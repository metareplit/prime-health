import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, Send, Image, Search, Check, CheckCheck, Loader2 } from "lucide-react";

export default function AdminMessages() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Tüm hastaları getir
  const { data: patients } = useQuery<User[]>({
    queryKey: ["/api/users/patients"],
  });

  // Seçili hasta için mesajları getir
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedUser],
    enabled: !!selectedUser,
    refetchInterval: 3000, // Her 3 saniyede bir güncelle
  });

  // Mesajı okundu olarak işaretle
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest("PATCH", `/api/messages/${messageId}/read`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  // Mesaj gönderme
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedUser) return;
      setIsUploading(true);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("receiverId", selectedUser.toString());
      attachments.forEach(file => {
        formData.append("attachments", file);
      });

      const res = await apiRequest("POST", "/api/messages", formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedUser] });
      setNewMessage("");
      setAttachments([]);
      setIsUploading(false);
      toast({
        title: "Başarılı",
        description: "Mesajınız başarıyla iletildi.",
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
    if (!newMessage.trim() || !selectedUser || isUploading) return;
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

  const filteredPatients = patients?.filter(patient =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-5rem)] flex gap-4">
      {/* Hasta Listesi */}
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Hastalar</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hasta ara..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-13rem)]">
            <div className="space-y-2">
              {filteredPatients?.map((patient) => (
                <Button
                  key={patient.id}
                  variant={selectedUser === patient.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedUser(patient.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{patient.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {patient.email}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mesajlar */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100vh-13rem)] flex flex-col">
          {selectedUser ? (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === selectedUser ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === selectedUser
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
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
                          {message.senderId !== selectedUser && (
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
              <div>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Mesajları görüntülemek için</p>
                <p>bir hasta seçin</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}