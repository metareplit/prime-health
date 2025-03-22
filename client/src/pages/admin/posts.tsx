import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";

export default function AdminPosts() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Yazıları</h1>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Yazılarda ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts?.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString("tr-TR") : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Düzenle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}