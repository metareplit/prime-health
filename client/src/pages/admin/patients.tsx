import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Patient } from "@shared/schema";

export default function AdminPatients() {
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Hasta Listesi</h1>

        <Card>
          <CardHeader>
            <CardTitle>Tüm Hastalar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Yükleniyor...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients?.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
