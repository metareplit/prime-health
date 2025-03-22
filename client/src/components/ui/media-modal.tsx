import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaModal({ open, onClose, onSelect }: MediaModalProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: mediaFiles, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiRequest("POST", "/api/media/upload", formData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setSelectedFile(null);
      toast({
        title: "Görsel yüklendi",
        description: "Görsel başarıyla yüklendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadMutation.mutateAsync(selectedFile);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">
            Medya Yöneticisi
          </Dialog.Title>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Yükleniyor..." : "Yükle"}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div>Yükleniyor...</div>
              ) : (
                mediaFiles?.map((media) => (
                  <div
                    key={media.id}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      onSelect(media.url);
                      onClose();
                    }}
                  >
                    <img
                      src={media.url}
                      alt={media.originalName}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">
                        {media.originalName}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}