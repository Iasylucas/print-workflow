import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "../types/assistant.types";

interface AssistantMessageProps {
  message: ChatMessage;
}

// --- Filet de sécurité : traduit les valeurs techniques restantes -------------
const LABELS: Record<string, string> = {
  waiting_for_file: "En attente de fichier",
  in_progress: "En cours",
  file_completed: "Fichier terminé",
  printing_in_progress: "En impression",
  cutting_in_progress: "En découpe",
  ready_for_delivery: "Prête à livrer",
  delivered: "Livrée",
  unpaid: "Impayée",
  partial: "Partiellement payée",
  paid: "Payée",
  pending: "En attente",
  converted: "Converti en facture",
};

const humanize = (text: string): string =>
  text
    // 1) statuts connus -> libellé français
    .replace(/\b[a-z]+(?:_[a-z]+)*\b/g, (word) => LABELS[word] ?? word)
    // 2) tout autre mot en snake_case restant -> espaces (jamais de "_" visible)
    .replace(/\b[a-z]+(?:_[a-z]+)+\b/g, (word) => word.replace(/_/g, " "));

// --- Rendu Markdown (tableaux lisibles, défilement horizontal) ---------------
const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="leading-relaxed [&:not(:first-child)]:mt-2">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => (
    <h3 className="mt-3 mb-1 text-base font-semibold">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mt-3 mb-1 text-base font-semibold">{children}</h3>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 text-sm font-semibold">{children}</h3>
  ),
  code: ({ children }) => (
    <code className="rounded bg-background/60 px-1 py-0.5 text-xs">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-3 w-full overflow-x-auto rounded-lg border bg-background">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
  th: ({ children }) => (
    <th className="whitespace-nowrap border-b px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b px-3 py-2 align-top text-sm">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="last:[&>td]:border-b-0 even:bg-muted/30">{children}</tr>
  ),
};

const AssistantMessageBase = ({ message }: AssistantMessageProps) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      {/* min-w-0 : indispensable pour que le tableau défile au lieu de déborder */}
      <div className="min-w-0 max-w-full flex-1 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {humanize(message.content)}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// memo : un message déjà affiché n'est pas re-rendu à chaque nouvelle frappe/réponse
export const AssistantMessage = memo(AssistantMessageBase);
