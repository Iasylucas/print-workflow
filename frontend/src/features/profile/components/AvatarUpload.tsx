// frontend/src/features/profile/components/AvatarUpload.tsx
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { cloudinaryApi } from "@/features/cloudinary/service/cloudinaryApi";
import { toast } from "sonner";

interface AvatarUploadProps {
  avatarUrl: string | null;
  name: string;
  onUploadSuccess: (url: string) => void;
}

export const AvatarUpload = ({
  avatarUrl,
  name,
  onUploadSuccess,
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // frontend/src/features/profile/components/AvatarUpload.tsx

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // ✅ Supprimer l'ancien avatar en envoyant l'URL complète
      if (avatarUrl) {
        await cloudinaryApi.deleteImage(avatarUrl); // ← Envoie l'URL complète
      }

      const result = await cloudinaryApi.uploadImage(file, "avatars");
      onUploadSuccess(result.secure_url);
      toast.success("Avatar mis à jour");
    } catch (error) {
      toast.error("Erreur lors de l'upload");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      <Avatar className="h-24 w-24 border-2 border-border">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <Button
        variant="outline"
        size="icon"
        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
        disabled={isUploading}
        asChild
      >
        <label>
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};
