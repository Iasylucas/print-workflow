import { useMutation } from "@tanstack/react-query";
import { assistantApi } from "../services/assistantApi";
import type { AssistantResponse } from "../types/assistant.types";

export const useAssistant = () => {
  return useMutation<AssistantResponse, Error, string>({
    mutationFn: (question: string) => assistantApi.ask(question),
  });
};
