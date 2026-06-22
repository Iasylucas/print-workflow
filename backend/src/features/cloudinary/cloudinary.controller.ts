import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "@/utils/catchAsync.js";

cloudinary.config({
  cloud_name: "dywspzxiw",
  api_key: "495278689116199",
  api_secret: "CeSCFhDpX1Xglm20Wc6vYDDovg0",
});

export const cloudinaryController = {
  generateSignature: catchAsync(async (req: Request, res: Response) => {
    const timestamp = Math.floor(Date.now() / 1000);

    const folder = req.body.folder || "avatars";
    const publicId = req.body.publicId;

    // const paramsToSign: Record<string, string | number> = {
    //   folder,
    //   timestamp,
    // };
    const paramsToSign = {
      folder: folder,
      public_id: publicId,
      timestamp: timestamp,
    };

    if (publicId) {
      paramsToSign.public_id = publicId;
    }

    // 🔴 LOG 1 : ce que Cloudinary signe
    console.log("=== PARAMS TO SIGN ===");
    console.log(paramsToSign);

    const secret = "CeSCFhDpX1Xglm20Wc6vYDDovg0";

    // 🔴 LOG 2 : vérification du secret
    console.log("=== SECRET DEBUG ===");
    console.log("length:", secret.length);
    console.log("value:", "[" + secret + "]");

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      "CeSCFhDpX1Xglm20Wc6vYDDovg0",
    );

    // 🔴 LOG 3 : signature générée
    console.log("=== GENERATED SIGNATURE ===");
    console.log(signature);

    return res.json({
      timestamp,
      folder,
      public_id: publicId,
      signature,
    });
  }),
};
