// frontend/src/features/company-info/components/CompanyLogoUpload.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoUploadProps {
  logoUrl: string | null;
  companyName: string;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export const CompanyLogoUpload = ({
  logoUrl,
  companyName,
  onFileSelect,
  className,
}: CompanyLogoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file);
    setIsLoading(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`Logo ${companyName}`}
          className="max-h-20 w-auto object-contain"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 text-2xl font-bold text-muted-foreground">
          {companyName.charAt(0).toUpperCase()}
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background shadow-md"
        disabled={isLoading}
        asChild
      >
        <label>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </Button>
    </div>
  );
};
