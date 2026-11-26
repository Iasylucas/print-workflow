// import { useEffect, useRef, useState } from "react";
// import { Sparkles, Send, Loader2, Trash2 } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// import TextareaAutosize from "react-textarea-autosize";
// import { useAssistant } from "../hooks/useAssistant";
// import { AssistantMessage } from "./AssistantMessage";
// import type { ChatMessage } from "../types/assistant.types";

// interface AssistantPanelProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const SUGGESTIONS = [
//   "Combien de commandes sont en attente fichier ?",
//   "Quel est le chiffre d'affaires du mois ?",
//   "Quelles sont les factures impayées ?",
//   "Combien de devis en attente ?",
// ];

// export const AssistantPanel = ({ open, onOpenChange }: AssistantPanelProps) => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const { mutateAsync, isPending } = useAssistant();

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isPending]);

//   const handleSend = async (question: string) => {
//     const trimmed = question.trim();
//     if (!trimmed || isPending) return;

//     const userMessage: ChatMessage = {
//       id: crypto.randomUUID(),
//       role: "user",
//       content: trimmed,
//       createdAt: new Date(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const response = await mutateAsync(trimmed);
//       const assistantMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         role: "assistant",
//         content: response.answer,
//         createdAt: new Date(),
//       };
//       setMessages((prev) => [...prev, assistantMessage]);
//     } catch {
//       const errorMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         role: "assistant",
//         content:
//           "Désolé, une erreur est survenue. Réessayez dans quelques instants.",
//         createdAt: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleSend(input);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(input);
//     }
//   };

//   const handleClear = () => {
//     setMessages([]);
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
//         <SheetHeader className="px-4 py-3 border-b shrink-0 pr-12">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
//                 <Sparkles className="h-4 w-4" />
//               </div>
//               <div>
//                 <SheetTitle className="text-base">
//                   Assistant EWAPrint
//                 </SheetTitle>
//                 <SheetDescription className="text-xs">
//                   Posez une question sur vos données
//                 </SheetDescription>
//               </div>
//             </div>
//             {messages.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleClear}
//                 className="h-8 w-8 text-muted-foreground"
//                 title="Effacer la conversation"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             )}
//           </div>
//         </SheetHeader>

//         <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
//           {messages.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
//                 <Sparkles className="h-6 w-6" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">
//                   Comment puis-je vous aider ?
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Je peux répondre sur les commandes, factures, devis, paiements
//                   et utilisateurs.
//                 </p>
//               </div>
//               <div className="w-full space-y-2 mt-4">
//                 {SUGGESTIONS.map((s) => (
//                   <button
//                     key={s}
//                     type="button"
//                     onClick={() => handleSend(s)}
//                     className="w-full text-left text-xs px-3 py-2 rounded-lg border bg-background/50 hover:bg-muted/50 transition-colors"
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {messages.map((msg) => (
//                 <AssistantMessage key={msg.id} message={msg} />
//               ))}
//               {isPending && (
//                 <div className="flex items-start gap-2.5">
//                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                     <Sparkles className="h-3.5 w-3.5" />
//                   </div>
//                   <div className="rounded-lg px-3 py-2 bg-muted">
//                     <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="border-t p-3 shrink-0 bg-background"
//         >
//           <div className="flex items-end gap-2">
//             <TextareaAutosize
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Posez votre question..."
//               minRows={1}
//               maxRows={6}
//               disabled={isPending}
//               className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
//             />
//             <Button
//               type="submit"
//               size="icon"
//               disabled={!input.trim() || isPending}
//               className="h-10 w-10 shrink-0"
//             >
//               {isPending ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//           <p className="text-[10px] text-muted-foreground mt-2 text-center">
//             L'assistant peut faire des erreurs. Vérifiez les informations
//             importantes.
//           </p>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// };
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  Sparkles,
  Send,
  Loader2,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { useAssistant } from "../hooks/useAssistant";
import { AssistantMessage } from "./AssistantMessage";
import type { ChatMessage } from "../types/assistant.types";

interface AssistantPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUGGESTIONS = [
  "Combien de commandes sont en attente fichier ?",
  "Quel est le chiffre d'affaires du mois ?",
  "Factures impayées avec leurs commandes",
  "Répartition des commandes par statut",
];

// --- Largeur du panel (redimensionnable) -------------------------------------
const WIDTH_KEY = "assistant-panel-width";
const MIN_WIDTH = 380;
const DEFAULT_WIDTH = 448;
const maxWidth = () => Math.floor(window.innerWidth * 0.9);
const clampWidth = (w: number) =>
  Math.min(Math.max(w, MIN_WIDTH), Math.max(MIN_WIDTH, maxWidth()));

const readStoredWidth = (): number => {
  try {
    const raw = localStorage.getItem(WIDTH_KEY);
    return clampWidth(raw ? Number(raw) : DEFAULT_WIDTH);
  } catch {
    return DEFAULT_WIDTH;
  }
};

export const AssistantPanel = ({ open, onOpenChange }: AssistantPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  // Identifiant de conversation envoyé au backend (mémoire côté serveur)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const [width, setWidth] = useState<number>(readStoredWidth);
  const widthRef = useRef(width);
  const [isResizing, setIsResizing] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const isNearBottom = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { mutateAsync, isPending } = useAssistant();

  // --- Scroll ----------------------------------------------------------------
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Ref callback : le contenu du Sheet est démonté à la fermeture, donc à chaque
  // réouverture l'élément est recréé. On descend tout en bas dès qu'il apparaît.
  const setScrollEl = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    if (el) {
      isNearBottom.current = true;
      el.scrollTop = el.scrollHeight;
      // 2e passage une frame plus tard : certains contenus (tableaux, markdown)
      // finissent de se mesurer après le premier rendu
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottom.current = distance < 80;
    setShowScrollButton(distance > 200);
  };

  // Nouveau message : on suit le bas si l'utilisateur y est déjà (ou s'il vient d'écrire)
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "user" || isNearBottom.current) {
      scrollToBottom("smooth");
    }
  }, [messages, isPending, scrollToBottom]);

  // Remet le focus dans la zone de saisie quand la réponse arrive
  useEffect(() => {
    if (open && !isPending) inputRef.current?.focus();
  }, [isPending, open]);

  // --- Redimensionnement -----------------------------------------------------
  useEffect(() => {
    const onWindowResize = () => setWidth((w) => clampWidth(w));
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsResizing(true);
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    // Le panel est collé à droite : largeur = distance entre le curseur et le bord droit
    setWidth(clampWidth(window.innerWidth - e.clientX));
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsResizing(false);
    try {
      localStorage.setItem(WIDTH_KEY, String(widthRef.current));
    } catch {
      /* stockage indisponible : on ignore */
    }
  };

  const handleResizeReset = () => {
    setWidth(DEFAULT_WIDTH);
    try {
      localStorage.setItem(WIDTH_KEY, String(DEFAULT_WIDTH));
    } catch {
      /* ignore */
    }
  };

  // --- Envoi -----------------------------------------------------------------
  const handleSend = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await mutateAsync({ question: trimmed, sessionId });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.answer,
          createdAt: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Désolé, une erreur est survenue. Réessayez dans quelques instants.",
          createdAt: new Date(),
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Nouvelle conversation = nouveau sessionId (le backend repart d'une mémoire vide)
  const handleClear = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={`p-0 bg-card flex flex-col ${isResizing ? "select-none" : ""}`}
        style={{ width: `min(${width}px, 100vw)`, maxWidth: "none" }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {/* Poignée de redimensionnement (bord gauche, desktop uniquement) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionner l'assistant"
          title="Glisser pour redimensionner · Double-clic pour réinitialiser"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          onPointerCancel={handleResizeEnd}
          onDoubleClick={handleResizeReset}
          className="group absolute left-0 top-0 z-20 hidden h-full w-3 -translate-x-1/2 cursor-col-resize touch-none items-center justify-center sm:flex"
        >
          <div
            className={`h-full w-px transition-colors ${
              isResizing
                ? "bg-primary"
                : "bg-transparent group-hover:bg-primary/60"
            }`}
          />
          <div
            className={`absolute h-10 w-1.5 rounded-full transition-opacity ${
              isResizing
                ? "bg-primary opacity-100"
                : "bg-border opacity-0 group-hover:opacity-100"
            }`}
          />
        </div>

        <SheetHeader className="px-4 py-3 border-b shrink-0 pr-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <SheetTitle className="text-base">
                  Assistant EWAPrint
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Posez une question sur vos données
                </SheetDescription>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 text-muted-foreground"
                title="Nouvelle conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div
            ref={setScrollEl}
            onScroll={handleScroll}
            className="h-full overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col justify-center">
                <div>
                  <p className="text-base font-semibold">
                    Comment puis-je vous aider ?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Je peux répondre sur les commandes, factures, devis,
                    paiements et utilisateurs.
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="group flex w-full items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <span>{s}</span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <AssistantMessage key={msg.id} message={msg} />
                ))}
                {isPending && (
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bouton "revenir en bas" quand on a remonté dans l'historique */}
          {showScrollButton && messages.length > 0 && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => scrollToBottom("smooth")}
              className="absolute bottom-3 right-4 h-8 w-8 rounded-full shadow-md"
              title="Aller au dernier message"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-3 shrink-0 bg-card">
          <div className="flex items-end gap-2 rounded-xl border bg-background p-2 focus-within:ring-2 focus-within:ring-ring/30">
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              minRows={1}
              maxRows={6}
              disabled={isPending}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isPending}
              className="size-8 shrink-0 rounded-lg"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            L'assistant peut faire des erreurs. Vérifiez les informations
            importantes.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
};
