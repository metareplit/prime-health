import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Media } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminMedia() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: mediaFiles, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const filteredMedia = mediaFiles?.filter(media =>
    media.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medya Kütüphanesi</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Medya Yükle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Medya Yükle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  className="hidden"
                  id="media-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p>Dosyaları buraya sürükleyin veya seçmek için tıklayın</p>
                </label>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Medya dosyalarında ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia?.map((media) => (
            <Card key={media.id} className="group relative">
              <CardContent className="p-2">
                <img
                  src={media.url}
                  alt={media.filename}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm truncate mt-2">{media.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {(media.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
