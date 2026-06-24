import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "@/utils/catchAsync.js";
import { env } from "@/config/env.js";
import { generateSignatureSchema } from "./cloudinary.schema.js";
import { SignatureResponse } from "./cloudinary.types.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinaryController = {
  generateSignature: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const validated = generateSignatureSchema.parse(req.body);

      const timestamp = Math.floor(Date.now() / 1000);

      const paramsToSign: Record<string, any> = {
        folder: validated.folder,
        timestamp,
      };

      if (validated.publicId) {
        paramsToSign.public_id = validated.publicId;
      }

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        env.CLOUDINARY_API_SECRET,
      );

      const signData: SignatureResponse = {
        timestamp,
        folder: validated.folder,
        public_id: validated.publicId,
        signature,
        apiKey: env.CLOUDINARY_API_KEY,
        cloudName: env.CLOUDINARY_CLOUD_NAME,
      };

      res.status(200).json(signData);
    },
  ),
};
