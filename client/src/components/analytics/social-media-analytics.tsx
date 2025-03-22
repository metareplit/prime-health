import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Örnek veri - gerçek uygulamada API'den gelecek
const facebookData = {
  followers: [
    { date: "Pazartesi", count: 1200 },
    { date: "Salı", count: 1250 },
    { date: "Çarşamba", count: 1280 },
    { date: "Perşembe", count: 1310 },
    { date: "Cuma", count: 1350 },
    { date: "Cumartesi", count: 1400 },
    { date: "Pazar", count: 1450 },
  ],
  engagement: [
    { type: "Beğeni", count: 850 },
    { type: "Yorum", count: 320 },
    { type: "Paylaşım", count: 150 },
  ],
  demographics: [
    { age: "18-24", percentage: 20 },
    { age: "25-34", percentage: 35 },
    { age: "35-44", percentage: 25 },
    { age: "45-54", percentage: 15 },
    { age: "55+", percentage: 5 },
  ],
};

const instagramData = {
  followers: [
    { date: "Pazartesi", count: 2200 },
    { date: "Salı", count: 2250 },
    { date: "Çarşamba", count: 2300 },
    { date: "Perşembe", count: 2400 },
    { date: "Cuma", count: 2450 },
    { date: "Cumartesi", count: 2500 },
    { date: "Pazar", count: 2600 },
  ],
  engagement: [
    { type: "Beğeni", count: 1200 },
    { type: "Yorum", count: 450 },
    { type: "Kaydetme", count: 300 },
  ],
  reachData: [
    { type: "Gösterim", count: 5000 },
    { type: "Erişim", count: 3500 },
    { type: "Profil Ziyareti", count: 800 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SocialMediaAnalytics() {
  const [activeTab, setActiveTab] = useState('facebook');

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sosyal Medya Analitikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
          </TabsList>

          <TabsContent value="facebook">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Takipçi Artışı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={facebookData.followers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#1877F2" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Etkileşim Dağılımı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facebookData.engagement}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {facebookData.engagement.map((entry, index) => (
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
                  <CardTitle className="text-sm">Demografik Dağılım</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facebookData.demographics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#1877F2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="instagram">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Takipçi Artışı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={instagramData.followers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#E4405F" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Etkileşim Analizi</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={instagramData.engagement}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {instagramData.engagement.map((entry, index) => (
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
                  <CardTitle className="text-sm">Erişim ve Gösterim</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={instagramData.reachData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#E4405F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
