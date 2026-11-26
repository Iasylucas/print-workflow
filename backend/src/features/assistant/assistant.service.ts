// import OpenAI from "openai";
// import { InternalServerError } from "@/shared/error/error.js";
// import { AssistantRepository } from "./assistant.repository.js";
// import {
//   assistantTools,
//   getOpenAIToolsFormat,
//   executeTool,
// } from "./assistant.tools.js";
// import {
//   ASSISTANT_ERRORS,
//   ASSISTANT_SYSTEM_PROMPT,
// } from "./assistant.constants.js";
// import type { AssistantResponse } from "./assistant.types.js";

// const MAX_ITERATIONS = 5;

// export class AssistantService {
//   private readonly client: OpenAI;

//   constructor(private readonly repository: AssistantRepository) {
//     this.client = new OpenAI({
//       apiKey: process.env.NVIDIA_API_KEY,
//       baseURL: "https://integrate.api.nvidia.com/v1",
//     });
//   }

//   async ask(question: string): Promise<AssistantResponse> {
//     try {
//       return await this.runConversation(question);
//     } catch (error) {
//       console.error("[Assistant] Erreur brute:", error);

//       const err = error as any;
//       const message = err?.message ?? "Erreur inconnue";

//       if (err?.status === 401) {
//         throw new InternalServerError("Clé API NVIDIA invalide ou expirée.");
//       }
//       if (err?.status === 404 || message.includes("model")) {
//         throw new InternalServerError(
//           "Le modèle NVIDIA n'est pas disponible. Vérifiez le nom du modèle.",
//         );
//       }
//       if (err?.status === 400) {
//         throw new InternalServerError(
//           `Requête invalide envoyée à NVIDIA : ${message}`,
//         );
//       }
//       if (err?.status === 429 || message.includes("rate")) {
//         throw new InternalServerError(
//           "L'assistant est momentanément surchargé. Réessayez dans quelques secondes.",
//         );
//       }
//       throw new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);
//     }
//   }

//   private async runConversation(question: string): Promise<AssistantResponse> {
//     const messages: any[] = [
//       { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
//       { role: "user", content: question },
//     ];

//     const tools = getOpenAIToolsFormat();

//     for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
//       const completion = await this.client.chat.completions.create({
//         // model: "nvidia/nemotron-3.5-bolt-e4b",
//         model: "nvidia/nemotron-3.5-bolt-e4b",
//         messages,
//         tools,
//         tool_choice: "auto",
//         temperature: 0.1,
//         max_tokens: 1024,
//       });

//       const message = completion.choices[0]?.message;
//       if (!message) {
//         throw new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);
//       }

//       if (!message.tool_calls || message.tool_calls.length === 0) {
//         return {
//           answer: message.content ?? "Je n'ai pas de réponse à cette question.",
//         };
//       }

//       messages.push({
//         role: "assistant",
//         content: message.content ?? null,
//         tool_calls: message.tool_calls,
//       });

//       for (const toolCall of message.tool_calls) {
//         if (toolCall.type !== "function") continue;

//         const functionTool =
//           toolCall as OpenAI.ChatCompletionMessageFunctionToolCall;
//         const toolName = functionTool.function.name;
//         let args: Record<string, unknown> = {};
//         try {
//           args = JSON.parse(functionTool.function.arguments || "{}");
//         } catch {
//           args = {};
//         }

//         const result = await executeTool(toolName, args);

//         messages.push({
//           role: "tool",
//           tool_call_id: functionTool.id,
//           content: JSON.stringify(result),
//         });
//       }
//     }

//     return {
//       answer:
//         "Je n'ai pas pu terminer le traitement de votre question. Essayez de la reformuler.",
//     };
//   }
// }

// export const assistantService = new AssistantService(new AssistantRepository());
import OpenAI from "openai";
import { InternalServerError } from "@/shared/error/error.js";
import { AssistantRepository } from "./assistant.repository.js";
import { getOpenAIToolsFormat, executeTool } from "./assistant.tools.js";
import { ASSISTANT_ERRORS, buildSystemPrompt } from "./assistant.constants.js";
import type { AssistantResponse } from "./assistant.types.js";

// --- Réglages ---------------------------------------------------------------
const MODEL = process.env.ASSISTANT_MODEL ?? "nvidia/nemotron-3.5-bolt-e4b";
const MAX_ITERATIONS = 8; // enchaînement d'outils (facture -> commandes -> statuts…)
const MAX_TOKENS = 2048; // 1024 coupait les réponses longues (tableaux)
const MAX_HISTORY_MESSAGES = 20; // 10 échanges user/assistant gardés en mémoire
const SESSION_TTL_MS = 30 * 60 * 1000; // une session expire après 30 min d'inactivité
const MAX_TOOL_RESULT_CHARS = 12_000; // protège le contexte contre les gros JSON

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type TextTurn = { role: "user" | "assistant"; content: string };

interface Session {
  turns: TextTurn[]; // on ne garde que le texte, pas les résultats d'outils (trop lourds)
  updatedAt: number;
}

export class AssistantService {
  private readonly client: OpenAI;
  private readonly sessions = new Map<string, Session>();

  constructor(private readonly repository: AssistantRepository) {
    this.client = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

    // Nettoyage périodique des sessions expirées
    setInterval(() => this.purgeSessions(), 5 * 60 * 1000).unref();
  }

  /**
   * @param sessionId identifiant de conversation (envoyé par le front, sinon userId)
   */
  async ask(question: string, sessionId: string): Promise<AssistantResponse> {
    const trimmed = question?.trim();
    if (!trimmed) {
      throw new InternalServerError(ASSISTANT_ERRORS.EMPTY_QUESTION);
    }

    try {
      const session = this.getSession(sessionId);
      const answer = await this.runConversation(trimmed, session.turns);

      // On mémorise uniquement la question et la réponse finale
      session.turns.push({ role: "user", content: trimmed });
      session.turns.push({ role: "assistant", content: answer });
      session.turns.splice(
        0,
        Math.max(0, session.turns.length - MAX_HISTORY_MESSAGES),
      );
      session.updatedAt = Date.now();

      return { answer };
    } catch (error) {
      console.error("[Assistant] Erreur brute:", error);
      throw this.mapError(error);
    }
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  // --- Boucle LLM + tools ---------------------------------------------------
  private async runConversation(
    question: string,
    history: TextTurn[],
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt() },
      ...history,
      { role: "user", content: question },
    ];

    const tools = getOpenAIToolsFormat();

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      const completion = await this.client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
      });

      const message = completion.choices[0]?.message;
      if (!message) throw new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return (
          message.content?.trim() || "Je n'ai pas de réponse à cette question."
        );
      }

      messages.push({
        role: "assistant",
        content: message.content ?? null,
        tool_calls: message.tool_calls,
      });

      // Outils indépendants exécutés en parallèle
      const toolMessages = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          if (toolCall.type !== "function") {
            return {
              role: "tool" as const,
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: "Type d'appel non supporté" }),
            };
          }

          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(toolCall.function.arguments || "{}");
          } catch {
            args = {};
          }

          const result = await executeTool(toolCall.function.name, args);
          return {
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: this.serializeToolResult(result),
          };
        }),
      );

      messages.push(...toolMessages);
    }

    // Plus de tours disponibles : on force une synthèse avec ce qu'on a déjà
    const final = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        ...messages,
        {
          role: "user",
          content:
            "Résume avec les données déjà récupérées. Si elles sont incomplètes, dis précisément ce qui manque.",
        },
      ],
      temperature: 0.2,
      max_tokens: MAX_TOKENS,
    });

    return (
      final.choices[0]?.message?.content?.trim() ||
      "Je n'ai pas pu terminer le traitement. Essayez de reformuler."
    );
  }

  // --- Utilitaires ----------------------------------------------------------
  private serializeToolResult(result: unknown): string {
    // Prisma renvoie parfois des BigInt / Date : on les rend sérialisables
    const json = JSON.stringify(result, (_k, v) =>
      typeof v === "bigint" ? v.toString() : v,
    );
    if (json.length <= MAX_TOOL_RESULT_CHARS) return json;
    return JSON.stringify({
      truncated: true,
      note: "Résultat tronqué (trop volumineux). Affine les filtres ou réduis la limite.",
      preview: json.slice(0, MAX_TOOL_RESULT_CHARS),
    });
  }

  private getSession(sessionId: string): Session {
    let session = this.sessions.get(sessionId);
    if (!session || Date.now() - session.updatedAt > SESSION_TTL_MS) {
      session = { turns: [], updatedAt: Date.now() };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  private purgeSessions(): void {
    const now = Date.now();
    for (const [id, s] of this.sessions) {
      if (now - s.updatedAt > SESSION_TTL_MS) this.sessions.delete(id);
    }
  }

  private mapError(error: unknown): InternalServerError {
    if (error instanceof InternalServerError) return error;

    const err = error as any;
    const message: string = err?.message ?? "Erreur inconnue";

    if (err?.status === 401)
      return new InternalServerError("Clé API NVIDIA invalide ou expirée.");
    if (err?.status === 404 || message.includes("model"))
      return new InternalServerError(
        "Le modèle NVIDIA n'est pas disponible. Vérifiez le nom du modèle.",
      );
    if (err?.status === 400)
      return new InternalServerError(
        `Requête invalide envoyée à NVIDIA : ${message}`,
      );
    if (err?.status === 429 || message.includes("rate"))
      return new InternalServerError(
        "L'assistant est momentanément surchargé. Réessayez dans quelques secondes.",
      );
    return new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);
  }
}

export const assistantService = new AssistantService(new AssistantRepository());
