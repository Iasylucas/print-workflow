import type { ApiResponse, ApiSuccess, ApiError } from "@/shared/types/";

/**
 * Extrait la propriété `data` d'une réponse API si `success` est true,
 * sinon lance une erreur avec le message contenu dans `error`.
 *
 * Cette fonction évite les `as` répétés et centralise la gestion des erreurs.
 */
export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (response.data.success) {
    // `data` est garanti d'exister dans ApiSuccess<T>
    return (response.data as ApiSuccess<T>).data as T;
  }
  // `error` est garanti d'exister dans ApiError
  throw new Error((response.data as ApiError).error);
}
