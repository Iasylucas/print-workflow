import { useAuthStore } from "@/features/auth/store/authStore";
import axios, { type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Tableau local typé pour stocker les chronos sans toucher aux types d'Axios
const requestTimestamps = new Map<string, number>();

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // On génère un identifiant unique pour cette requête
  const requestId = config.url || Math.random().toString();
  requestTimestamps.set(requestId, Date.now());

  // On stocke cet ID directement dans les en-têtes (headers) d'Axios
  config.headers["X-Request-Id"] = requestId;

  return config;
});

// Fonction utilitaire de délai, proprement typée avec l'interface officielle d'Axios
const handleDelay = async (config?: AxiosRequestConfig): Promise<void> => {
  const requestId = config?.headers?.["X-Request-Id"];

  if (typeof requestId === "string") {
    const startTime = requestTimestamps.get(requestId);

    if (startTime) {
      const duration = Date.now() - startTime;
      const minimalDelay = 400;

      if (duration < minimalDelay) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, minimalDelay - duration),
        );
      }
      // Nettoyage de la Map pour éviter les fuites de mémoire
      requestTimestamps.delete(requestId);
    }
  }
};

api.interceptors.response.use(
  async (response) => {
    await handleDelay(response.config);
    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      await handleDelay(error.config);
    }

    // 💡 LA BARRIÈRE ANTI-401 : Si le token a expiré ou est falsifié
    if (error.response?.status === 401) {
      console.warn("Session expirée ou invalide. Nettoyage...");

      useAuthStore.getState().logout();

      // window.location.href = "/login";
    }

    const serverData = error.response?.data as
      | { error?: string; message?: string }
      | undefined;

    const friendlyMessage =
      serverData?.error ||
      serverData?.message ||
      error.message ||
      "Une erreur est survenue";

    return Promise.reject(new Error(friendlyMessage));
  },
);

// api.interceptors.response.use(
//   async (response) => {
//     await handleDelay(response.config);
//     return response;
//   },
//   async (error) => {
//     // Utilisation de la garde de type officielle d'Axios pour un typage strict
//     if (axios.isAxiosError(error)) {
//       await handleDelay(error.config);
//     }

//     const serverData = error.response?.data as
//       | { error?: string; message?: string }
//       | undefined;

//     const friendlyMessage =
//       serverData?.error ||
//       serverData?.message ||
//       error.message ||
//       "Une erreur est survenue";

//     return Promise.reject(new Error(friendlyMessage));
//   },
// );
