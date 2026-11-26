// import { api } from "@/lib/axios";
// import { unwrap } from "@/lib/apiUtils";
// import type { ApiResponse } from "@/shared/types";
// import type { AssistantResponse } from "../types/assistant.types";

// export const assistantApi = {
//   ask: (question: string) =>
//     api
//       .post<ApiResponse<AssistantResponse>>("/assistant/query", { question })
//       .then(unwrap),
// };
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type { AssistantResponse } from "../types/assistant.types";

export const assistantApi = {
  ask: (question: string, sessionId: string) =>
    api
      .post<ApiResponse<AssistantResponse>>("/assistant/query", {
        question,
        sessionId,
      })
      .then(unwrap),
};
