import OpenAI from "openai";
import { InternalServerError } from "@/shared/error/error.js";
import { AssistantRepository } from "./assistant.repository.js";
import {
  assistantTools,
  getOpenAIToolsFormat,
  executeTool,
} from "./assistant.tools.js";
import {
  ASSISTANT_ERRORS,
  ASSISTANT_SYSTEM_PROMPT,
} from "./assistant.constants.js";
import type { AssistantResponse } from "./assistant.types.js";

const MAX_ITERATIONS = 5;

export class AssistantService {
  private readonly client: OpenAI;

  constructor(private readonly repository: AssistantRepository) {
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async ask(question: string): Promise<AssistantResponse> {
    try {
      return await this.runConversation(question);
    } catch (error) {
      console.error("[Assistant] Erreur brute:", error);

      const err = error as any;
      const message = err?.message ?? "Erreur inconnue";

      if (err?.status === 401) {
        throw new InternalServerError("Clé API Groq invalide ou expirée.");
      }
      if (err?.status === 404 || message.includes("model")) {
        throw new InternalServerError(
          "Le modèle Groq n'est pas disponible. Vérifiez le nom du modèle.",
        );
      }
      if (err?.status === 400) {
        throw new InternalServerError(
          `Requête invalide envoyée à Groq : ${message}`,
        );
      }
      if (err?.status === 429 || message.includes("rate")) {
        throw new InternalServerError(
          "L'assistant est momentanément surchargé. Réessayez dans quelques secondes.",
        );
      }
      throw new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);
    }
  }

  private async runConversation(question: string): Promise<AssistantResponse> {
    const messages: any[] = [
      { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
      { role: "user", content: question },
    ];

    const tools = getOpenAIToolsFormat();

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      const completion = await this.client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.1,
        max_tokens: 1024,
      });

      const message = completion.choices[0]?.message;
      if (!message) {
        throw new InternalServerError(ASSISTANT_ERRORS.LLM_FAILED);
      }

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return {
          answer: message.content ?? "Je n'ai pas de réponse à cette question.",
        };
      }

      messages.push({
        role: "assistant",
        content: message.content ?? null,
        tool_calls: message.tool_calls,
      });

      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function") continue;

        const functionTool =
          toolCall as OpenAI.ChatCompletionMessageFunctionToolCall;
        const toolName = functionTool.function.name;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(functionTool.function.arguments || "{}");
        } catch {
          args = {};
        }

        const result = await executeTool(toolName, args);

        messages.push({
          role: "tool",
          tool_call_id: functionTool.id,
          content: JSON.stringify(result),
        });
      }
    }

    return {
      answer:
        "Je n'ai pas pu terminer le traitement de votre question. Essayez de la reformuler.",
    };
  }
}

export const assistantService = new AssistantService(new AssistantRepository());
