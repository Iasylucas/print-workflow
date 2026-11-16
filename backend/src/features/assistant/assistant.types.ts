import { z } from "zod";
import { assistantQuerySchema } from "./assistant.schema.js";

export type AssistantQuery = z.infer<typeof assistantQuerySchema>;

export type AssistantResponse = {
  answer: string;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: z.ZodTypeAny;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

export type OpenAIToolFormat = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};
