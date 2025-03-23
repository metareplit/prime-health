import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bildirimler</h1>
          <p className="text-muted-foreground">
            Sistem bildirimleri ve duyurular
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Bildirimler</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bildirim listesi burada olacak */}
          <p className="text-muted-foreground">Henüz bildirim bulunmuyor.</p>
        </CardContent>
      </Card>
    </div>
  );
}
