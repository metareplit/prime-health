import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function AdminSystem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistem Durumu</h1>
          <p className="text-muted-foreground">
            Sistem performansı ve durum bilgileri
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sunucu Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>CPU Kullanımı</span>
                <span className="text-green-500">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bellek Kullanımı</span>
                <span className="text-green-500">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Disk Kullanımı</span>
                <span className="text-green-500">Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Güncellemeleri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sistem güncel durumda.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
