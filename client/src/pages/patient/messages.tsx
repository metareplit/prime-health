import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { MessageSquare, Send, Image, Check, CheckCheck, Loader2 } from "lucide-react";
import type { Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PatientMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch messages
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 3000, // Her 3 saniyede bir güncelle
  });

  // Mesaj gönderme
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("content", content);
      attachments.forEach(file => {
        formData.append("attachments", file);
      });

      const res = await apiRequest("POST", "/api/messages", formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMessage("");
      setAttachments([]);
      setIsUploading(false);
      toast({
        title: "Başarılı",
        description: "Mesajınız başarıyla gönderildi.",
      });
    },
    onError: (error: Error) => {
      setIsUploading(false);
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isUploading) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Dosya boyutu kontrolü
      const files = Array.from(e.target.files);
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (totalSize > maxSize) {
        toast({
          title: "Hata",
          description: "Toplam dosya boyutu 10MB'ı geçemez.",
          variant: "destructive",
        });
        return;
      }

      setAttachments(files);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mesajlarım
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              {messages?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Henüz mesajınız bulunmuyor.</p>
                  <p className="text-sm">Kliniğimizle iletişime geçmek için mesaj gönderebilirsiniz.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm underline"
                              >
                                <Image className="h-4 w-4" />
                                Ek {index + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                          <span>
                            {new Date(message.createdAt).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message.senderId === user?.id && (
                            message.isRead === "true" ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1"
                disabled={isUploading}
              />
              <Input
                type="file"
                id="attachments"
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("attachments")?.click()}
                disabled={isUploading}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={!newMessage.trim() || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}