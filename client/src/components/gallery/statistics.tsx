import { useState } from 'react';
import { Card } from "@/components/ui/card";
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
  Cell
} from 'recharts';

const satisfactionData = [
  { name: 'Çok Memnun', value: 85 },
  { name: 'Memnun', value: 12 },
  { name: 'Orta', value: 2 },
  { name: 'Memnun Değil', value: 1 },
];

const procedureData = [
  { name: 'Saç Ekimi', count: 5000 },
  { name: 'Sakal Ekimi', count: 2500 },
  { name: 'Kaş Ekimi', count: 1500 },
];

const monthlyData = [
  { month: 'Ocak', procedures: 120 },
  { month: 'Şubat', procedures: 150 },
  { month: 'Mart', procedures: 180 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export function Statistics() {
  const [activeTab, setActiveTab] = useState('satisfaction');

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">İstatistikler ve Analizler</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="satisfaction">Memnuniyet</TabsTrigger>
          <TabsTrigger value="procedures">İşlem Dağılımı</TabsTrigger>
          <TabsTrigger value="monthly">Aylık Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="satisfaction">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {satisfactionData.map((item, index) => (
              <div key={item.name} className="text-center">
                <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                  {item.value}%
                </div>
                <div className="text-sm text-gray-500">{item.name}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="procedures">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procedureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="procedures" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}