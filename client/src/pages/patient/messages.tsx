import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import type { Message } from "@shared/schema";

export default function PatientMessages() {
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mesajlarım</h1>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Yeni Mesaj
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mesajlar</CardTitle>
          </CardHeader>
          <CardContent>
            {messages?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Henüz mesajınız bulunmuyor.</p>
              </div>
            )}
            
            {messages?.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-4 p-4 border-b last:border-0"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {message.senderId === 1 ? "Doktor" : "Ben"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{message.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="fixed bottom-8 right-8">
          <Button size="lg" className="rounded-full h-16 w-16">
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
