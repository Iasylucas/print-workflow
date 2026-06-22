import React, { useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentUrl: string | null | undefined;
  fallbackText: string;
  onChange: (file: File | null) => void;
  isPending?: boolean;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentUrl,
  fallbackText,
  onChange,
  isPending = false,
  className,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDecoding, setIsDecoding] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onChange(file);

      setIsDecoding(true);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const showSpinner = isDecoding;

  const isDisabled = isPending || isDecoding;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative group rounded-full overflow-hidden h-20 w-20 border border-border cursor-pointer">
        <Avatar className="h-full w-full">
          <AvatarImage
            src={previewUrl || currentUrl || ""}
            alt="Avatar"
            onLoad={() => {
              setTimeout(() => {
                setIsDecoding(false);
              }, 450);
            }}
            onError={() => setIsDecoding(false)}
          />
          <AvatarFallback className="text-lg font-bold bg-muted select-none">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        <label
          htmlFor="avatar-file-input"
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-200 text-[10px] gap-0.5",
            showSpinner
              ? "bg-black/40 opacity-100 cursor-not-allowed"
              : isDisabled
                ? "opacity-0 cursor-not-allowed"
                : "bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer",
          )}
        >
          {showSpinner ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span>Changer</span>
            </>
          )}
        </label>

        <input
          id="avatar-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isDisabled}
        />
      </div>
      <p className="text-xs text-muted-foreground select-none">
        Formats acceptés : JPG, PNG
      </p>
    </div>
  );
};
