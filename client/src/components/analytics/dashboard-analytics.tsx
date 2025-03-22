import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";

// Örnek veri - gerçek uygulamada API'den gelecek
const browserData = [
  { name: "Chrome", value: 65 },
  { name: "Firefox", value: 15 },
  { name: "Safari", value: 12 },
  { name: "Edge", value: 8 },
];

const deviceData = [
  { name: "Masaüstü", value: 55 },
  { name: "Mobil", value: 35 },
  { name: "Tablet", value: 10 },
];

const trafficSourceData = [
  { name: "Organik Arama", value: 45 },
  { name: "Direkt", value: 25 },
  { name: "Sosyal Medya", value: 20 },
  { name: "Referans", value: 10 },
];

const keywordPerformanceData = [
  { keyword: "saç ekimi", tıklama: 1200, gösterim: 15000, sıralama: 3 },
  { keyword: "saç ekimi fiyatları", tıklama: 800, gösterim: 10000, sıralama: 5 },
  { keyword: "sakal ekimi", tıklama: 600, gösterim: 8000, sıralama: 2 },
  { keyword: "kaş ekimi", tıklama: 400, gösterim: 5000, sıralama: 4 },
];

const visitorTrendData = [
  { tarih: "Pazartesi", ziyaretçi: 150 },
  { tarih: "Salı", ziyaretçi: 180 },
  { tarih: "Çarşamba", ziyaretçi: 200 },
  { tarih: "Perşembe", ziyaretçi: 220 },
  { tarih: "Cuma", ziyaretçi: 250 },
  { tarih: "Cumartesi", ziyaretçi: 280 },
  { tarih: "Pazar", ziyaretçi: 240 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function DashboardAnalytics() {
  const [activeTab, setActiveTab] = useState('visitors');

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Detaylı Analitikler</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="visitors">Ziyaretçi Analizi</TabsTrigger>
            <TabsTrigger value="browsers">Tarayıcı/Cihaz</TabsTrigger>
            <TabsTrigger value="traffic">Trafik Kaynakları</TabsTrigger>
            <TabsTrigger value="seo">SEO Performans</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tarih" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ziyaretçi" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="browsers">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[300px]">
                <h3 className="text-sm font-medium mb-4">Tarayıcı Dağılımı</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={browserData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {browserData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[300px]">
                <h3 className="text-sm font-medium mb-4">Cihaz Dağılımı</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficSourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="seo">
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Anahtar Kelime</th>
                    <th className="text-right py-2">Tıklama</th>
                    <th className="text-right py-2">Gösterim</th>
                    <th className="text-right py-2">Sıralama</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordPerformanceData.map((keyword) => (
                    <tr key={keyword.keyword} className="border-b">
                      <td className="py-2">{keyword.keyword}</td>
                      <td className="text-right py-2">{keyword.tıklama}</td>
                      <td className="text-right py-2">{keyword.gösterim}</td>
                      <td className="text-right py-2">{keyword.sıralama}.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
