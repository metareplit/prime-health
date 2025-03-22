import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
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
} from "recharts";

// Örnek veri - gerçek uygulamada API'den gelecek
const keywordPerformance = [
  { keyword: "saç ekimi", sıralama: 2, tıklama: 1500, gösterim: 15000 },
  { keyword: "saç ekimi fiyatları", sıralama: 3, tıklama: 1200, gösterim: 12000 },
  { keyword: "sakal ekimi", sıralama: 1, tıklama: 800, gösterim: 8000 },
  { keyword: "kaş ekimi", sıralama: 4, tıklama: 600, gösterim: 6000 },
  { keyword: "saç ekimi istanbul", sıralama: 5, tıklama: 500, gösterim: 5000 },
];

const trafficSources = [
  { source: "Organik Arama", users: 5500 },
  { source: "Sosyal Medya", users: 2500 },
  { source: "Direkt", users: 1500 },
  { source: "Referans", users: 1000 },
  { source: "Email", users: 500 },
];

const pagePerformance = [
  { page: "/sac-ekimi", görüntülenme: 3000, ortalamaSüre: "2:30" },
  { page: "/sakal-ekimi", görüntülenme: 2000, ortalamaSüre: "2:15" },
  { page: "/kas-ekimi", görüntülenme: 1500, ortalamaSüre: "1:45" },
  { page: "/blog", görüntülenme: 1200, ortalamaSüre: "3:00" },
  { page: "/iletisim", görüntülenme: 1000, ortalamaSüre: "1:30" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SEOAnalytics() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>SEO ve Anahtar Kelime Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Anahtar Kelime Performansı</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={keywordPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="keyword" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tıklama" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Trafik Kaynakları</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="users"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Sayfa Performansı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Sayfa</th>
                      <th className="text-right p-3">Görüntülenme</th>
                      <th className="text-right p-3">Ort. Süre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagePerformance.map((page) => (
                      <tr key={page.page} className="border-b">
                        <td className="p-3">{page.page}</td>
                        <td className="text-right p-3">{page.görüntülenme}</td>
                        <td className="text-right p-3">{page.ortalamaSüre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
