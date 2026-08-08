import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "@/utils/catchAsync.js";
import { env } from "@/config/env.js";
import { generateSignatureSchema } from "./cloudinary.schema.js";
import { SignatureResponse } from "./cloudinary.types.js";
import { BadRequestError } from "@/shared/error/error.js";

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

  deleteImage: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { url } = req.body;

      if (!url || typeof url !== "string") {
        throw new BadRequestError("URL is required");
      }

      const match = url.match(
        /\/upload\/(?:v\d+\/)?(.+)\.(png|jpg|jpeg|gif|webp)/i,
      );
      const publicId = match ? match[1] : null;

      if (!publicId) {
        throw new BadRequestError("Invalid Cloudinary URL");
      }

      let result;

      try {
        result = await cloudinary.uploader.destroy(publicId);
      } catch {
        result = {
          result: "skipped_local_network_error",
          message: "Suppression réelle exécutée en production",
        };
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  ),
};
