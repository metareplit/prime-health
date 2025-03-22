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
  Legend,
  Area,
  AreaChart,
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

const visitorTrendData = Array.from({ length: 30 }, (_, i) => ({
  tarih: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
  ziyaretçi: Math.floor(Math.random() * 300) + 100,
  dönüşüm: Math.floor(Math.random() * 30) + 5,
}));

const bounceRateData = Array.from({ length: 12 }, (_, i) => ({
  ay: new Date(2024, i, 1).toLocaleDateString('tr-TR', { month: 'short' }),
  oran: Math.floor(Math.random() * 30) + 40,
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="text-sm">
            {pld.name}: {pld.value}
            {pld.name === "oran" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Site Analitikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="visitors">Ziyaretçi Analizi</TabsTrigger>
            <TabsTrigger value="technology">Teknoloji</TabsTrigger>
            <TabsTrigger value="conversion">Dönüşüm</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">30 Günlük Ziyaretçi Trendi</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitorTrendData}>
                      <defs>
                        <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tarih" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="ziyaretçi" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorVisitor)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Aylık Çıkış Oranı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bounceRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ay" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="oran" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visitors">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tarih" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ziyaretçi" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="technology">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tarayıcı Dağılımı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cihaz Dağılımı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="conversion">
            {/* Placeholder for conversion tab -  To be implemented based on requirements. */}
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}