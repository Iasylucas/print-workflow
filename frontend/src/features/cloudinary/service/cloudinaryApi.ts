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
    const response = await api.post<SignatureResponse>(
      "/cloudinary/signature",
      { folder, publicId },
    );
    const data = await response;
    return data;
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
    const response = await cloudinaryApi.getSignature(folder, publicId);
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
    const uploadResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    return {
      url: data.url,
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  },
};
