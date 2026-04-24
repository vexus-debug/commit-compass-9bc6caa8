import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Image, Video, X, Upload, Loader2, FileImage } from "lucide-react";

interface MediaUploadProps {
  mediaUrls: string[];
  onMediaChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function MarketingMediaUpload({ mediaUrls, onMediaChange, maxFiles = 10 }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxFiles - mediaUrls.length;
    if (remaining <= 0) {
      toast({ title: "Max files reached", description: `Maximum ${maxFiles} files allowed.`, variant: "destructive" });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of filesToUpload) {
        const ext = file.name.split(".").pop();
        const filePath = `campaigns/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("marketing-media")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("marketing-media")
          .getPublicUrl(filePath);

        newUrls.push(urlData.publicUrl);
      }

      onMediaChange([...mediaUrls, ...newUrls]);
      toast({ title: "Media uploaded", description: `${newUrls.length} file(s) uploaded successfully.` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = mediaUrls.filter((_, i) => i !== index);
    onMediaChange(updated);
  };

  const getFileType = (url: string): "image" | "video" | "other" => {
    const lower = url.toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) return "image";
    if (/\.(mp4|webm|mov|avi)/.test(lower)) return "video";
    return "other";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || mediaUrls.length >= maxFiles}
        >
          {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
          {uploading ? "Uploading..." : "Upload Media"}
        </Button>
        <span className="text-xs text-muted-foreground">
          {mediaUrls.length}/{maxFiles} files • Images, videos, PDFs
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={handleUpload}
        className="hidden"
      />

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {mediaUrls.map((url, index) => {
            const type = getFileType(url);
            return (
              <div key={index} className="relative group rounded-lg border overflow-hidden bg-muted aspect-square">
                {type === "image" ? (
                  <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                ) : type === "video" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Video</span>
                    <video src={url} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" muted />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">File</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
