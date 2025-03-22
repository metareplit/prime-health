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
  Legend,
  Area,
  AreaChart,
} from "recharts";

// Örnek veri - gerçek uygulamada API'den gelecek
const facebookData = {
  followers: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
    takipçi: Math.floor(Math.random() * 50) + 1200,
    etkileşim: Math.floor(Math.random() * 200) + 300,
  })),
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
  postPerformance: Array.from({ length: 10 }, (_, i) => ({
    post: `Post ${i + 1}`,
    erişim: Math.floor(Math.random() * 1000) + 500,
    etkileşim: Math.floor(Math.random() * 200) + 100,
  })),
};

const instagramData = {
  followers: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
    takipçi: Math.floor(Math.random() * 100) + 2200,
    etkileşim: Math.floor(Math.random() * 300) + 500,
  })),
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
  stories: Array.from({ length: 7 }, (_, i) => ({
    gün: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { weekday: 'short' }),
    görüntülenme: Math.floor(Math.random() * 500) + 200,
    etkileşim: Math.floor(Math.random() * 100) + 50,
  })),
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="text-sm">
            {pld.name}: {pld.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
                  <CardTitle className="text-sm">Takipçi ve Etkileşim Trendi</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={facebookData.followers}>
                      <defs>
                        <linearGradient id="colorTakipci" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1877F2" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1877F2" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEtkilesim" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#42B72A" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#42B72A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="takipçi" 
                        stroke="#1877F2" 
                        fillOpacity={1} 
                        fill="url(#colorTakipci)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="etkileşim" 
                        stroke="#42B72A" 
                        fillOpacity={1} 
                        fill="url(#colorEtkilesim)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Demografik Dağılım</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facebookData.demographics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="percentage" 
                        fill="#1877F2"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
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
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      >
                        {facebookData.engagement.map((entry, index) => (
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
                  <CardTitle className="text-sm">Gönderi Performansı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facebookData.postPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="post" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="erişim" fill="#1877F2" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="etkileşim" fill="#42B72A" radius={[4, 4, 0, 0]} />
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
                  <CardTitle className="text-sm">Takipçi ve Etkileşim Trendi</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={instagramData.followers}>
                      <defs>
                        <linearGradient id="colorInstaFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E4405F" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#E4405F" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInstaEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#833AB4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#833AB4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="takipçi" 
                        stroke="#E4405F" 
                        fillOpacity={1} 
                        fill="url(#colorInstaFollowers)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="etkileşim" 
                        stroke="#833AB4" 
                        fillOpacity={1} 
                        fill="url(#colorInstaEngagement)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Hikaye Performansı</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={instagramData.stories}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gün" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="görüntülenme" fill="#E4405F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="etkileşim" fill="#833AB4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Erişim ve Gösterim</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={instagramData.reachData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#E4405F"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
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
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      >
                        {instagramData.engagement.map((entry, index) => (
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
        </Tabs>
      </CardContent>
    </Card>
  );
}