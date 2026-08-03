import { z } from "zod";
import { generateSignatureSchema } from "./cloudinary.schema.js";

export type GenerateSignatureInput = z.infer<typeof generateSignatureSchema>;

export interface SignatureResponse {
  timestamp: number;
  folder: string;
  public_id?: string;
  signature: string;
  apiKey: string;
  cloudName: string;
}
