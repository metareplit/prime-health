import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <Link href={`/randevu?service=${service.slug}`}>
          <Button className="w-full">Randevu Al</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
