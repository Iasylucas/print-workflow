import { api } from "@/lib/axios";
interface SignatureResponse {
  timestamp: number;
  folder: string;
  public_id?: string;
  signature: string;
  apiKey: string;
  cloudName: string;
}

interface UploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
}

export const cloudinaryApi = {
  getSignature: async (folder: string = "avatars", publicId?: string) => {
    try {
      const response = await api.post<SignatureResponse>(
        "/cloudinary/signature",
        { folder, publicId },
      );
      console.log("📥 Réponse brute:", response);

      const data = await response;
      console.log("✅ Signature reçue:", data);
      return data;
    } catch (error) {
      console.error("❌ Erreur getSignature:", error);
      throw error;
    }
  },

  deleteImage: async (url: string) => {
    const response = await api.delete("/cloudinary/image", {
      data: { url },
    });
    return response.data;
  },

  uploadImage: async (
    file: File,
    folder: string = "avatars",
    publicId?: string,
  ): Promise<UploadResponse> => {
    console.log("📤 Uploading file:", file.name);

    const response = await cloudinaryApi.getSignature(folder, publicId);
    console.log("🔑 Signature reçue:", response);

    const { apiKey, cloudName, timestamp, signature } = response.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);
    if (publicId) {
      formData.append("public_id", publicId);
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("🌐 Uploading to:", cloudinaryUrl);

    const uploadResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      console.error("❌ Upload failed:", text);
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    console.log("✅ Upload success:", data);
    return {
      url: data.url,
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  },
};
