import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Post } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { Search, Plus, FileText, Edit, Trash, Image, Eye } from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Saç Bakımı",
  "Cilt Bakımı",
  "Saç Ekimi",
  "Estetik",
  "Sağlık",
  "Güzellik",
];

export default function AdminPosts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Başarılı",
        description: "Blog yazısı silindi.",
      });
    },
  });

  const filteredPosts = posts?.filter(post =>
    (post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || post.status === statusFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Yazıları</h1>
          <p className="text-muted-foreground">
            Blog yazılarını yönetin ve yeni içerik ekleyin
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Yazılarda ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
            <SelectItem value="published">Yayında</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts?.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </Badge>
                    {post.category && (
                      <Badge variant="outline">{post.category}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt || post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("tr-TR") : ""}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span>•</span>
                        <div className="flex gap-1">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/posts/${post.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}