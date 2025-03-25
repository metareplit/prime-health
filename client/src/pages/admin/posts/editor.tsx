import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation } from "wouter";
import { Post, insertPostSchema } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Save, ArrowLeft, ImagePlus } from "lucide-react";
import { Link } from "wouter";

const categories = [
  "Saç Bakımı",
  "Cilt Bakımı",
  "Saç Ekimi",
  "Estetik",
  "Sağlık",
  "Güzellik",
];

// Form şeması
const formSchema = insertPostSchema.extend({
  tags: z.string().transform(val => val.split(',').map(t => t.trim())),
  metaKeywords: z.string().transform(val => val.split(',').map(t => t.trim())).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostEditor({ id }: { id?: string }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const isEditing = Boolean(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      category: "",
      tags: "",
      seoTitle: "",
      seoDescription: "",
      metaKeywords: "",
      canonical: "",
      featuredImage: "",
      ogImage: ""
    },
  });

  // Mevcut yazıyı yükle
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: [`/api/posts/${id}`],
    enabled: Boolean(id),
  });

  // Form verilerini yükle
  useEffect(() => {
    if (post) {
      form.reset({
        ...post,
        tags: post.tags?.join(', ') || '',
        metaKeywords: post.metaKeywords?.join(', ') || '',
      });
      setContent(post.content);
    }
  }, [post]);

  // Kaydetme işlemi
  const saveMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Otomatik slug oluştur
      if (!data.slug) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      // SEO başlığı otomatik doldur
      if (!data.seoTitle) {
        data.seoTitle = data.title;
      }

      const response = await apiRequest(
        isEditing ? "PATCH" : "POST",
        isEditing ? `/api/posts/${id}` : "/api/posts",
        { ...data, content }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Başarılı",
        description: `Blog yazısı ${isEditing ? 'güncellendi' : 'oluşturuldu'}.`,
      });
      navigate("/admin/posts");
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Link href="/admin/posts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Yazıyı Düzenle" : "Yeni Yazı"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Blog yazısını oluşturun veya düzenleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {post?.slug && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Önizle
              </Link>
            </Button>
          )}
          <Button onClick={form.handleSubmit((data) => saveMutation.mutate(data))}>
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </div>

      <Form {...form}>
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="media">Medya</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="otomatik-olusturulacak" />
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiketler</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Etiketleri virgülle ayırarak yazın"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durum</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Durum seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Taslak</SelectItem>
                          <SelectItem value="published">Yayınla</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>İçerik</FormLabel>
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={content}
                    onEditorChange={setContent}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                        'codesample'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help | codesample | link image media',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      file_picker_types: 'image',
                      automatic_uploads: true,
                      images_upload_url: '/api/media/upload'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Başlığı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Başlık otomatik kullanılacak" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Açıklaması</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Sayfanın kısa açıklaması (150-160 karakter)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Anahtar Kelimeler</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Anahtar kelimeleri virgülle ayırın" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/blog/post" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medya Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Öne Çıkan Görsel</FormLabel>
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative w-40 h-40">
                            <img
                              src={field.value}
                              alt="Öne çıkan görsel"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => field.onChange("")}
                            >
                              <ImagePlus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-40 h-40"
                            onClick={() => {
                              // TODO: Implement image upload
                            }}
                          >
                            <ImagePlus className="h-6 w-6" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sosyal Medya Görseli</FormLabel>
                      <div className="flex items-center gap-4">
                        {field.value ? (
                          <div className="relative w-40 h-40">
                            <img
                              src={field.value}
                              alt="Sosyal medya görseli"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => field.onChange("")}
                            >
                              <ImagePlus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-40 h-40"
                            onClick={() => {
                              // TODO: Implement image upload
                            }}
                          >
                            <ImagePlus className="h-6 w-6" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Form>
    </div>
  );
}