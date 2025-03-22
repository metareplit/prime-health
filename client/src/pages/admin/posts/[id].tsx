```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertPostSchema, type InsertPost, type Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function EditPost({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", params.id],
  });

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    values: post as InsertPost,
  });

  const updatePost = useMutation({
    mutationFn: async (data: Partial<Post>) => {
      const res = await apiRequest("PATCH", `/api/posts/${params.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Blog yazısı güncellendi",
        description: "Değişiklikler başarıyla kaydedildi.",
      });
      setLocation("/admin/posts");
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertPost) => {
    setIsSubmitting(true);
    try {
      await updatePost.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Yazısını Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Yazısı Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input placeholder="Yazı başlığı..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Özet</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Yazı özeti..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Yazı içeriği..."
                        className="h-64"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  Kaydet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/posts")}
                >
                  İptal
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```
