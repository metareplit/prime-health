import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, HelpCircle } from "lucide-react";
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Hizmetlerimiz</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Modern teknoloji ve uzman kadromuzla en iyi sonuçları elde etmeniz için yanınızdayız.
        </p>

        {isLoading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-12">
            {services?.map((service) => (
              <Card key={service.id} id={service.slug} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="p-6">
                    <CardHeader>
                      <div className="flex justify-between items-center mb-4">
                        <CardTitle className="text-2xl">{service.name}</CardTitle>
                        <Badge variant="secondary" className="text-lg">
                          {service.price} €
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{service.longDescription}</p>

                      <div className="flex items-center gap-2 mb-6">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span>{service.duration}</span>
                      </div>

                      <div className="mb-8">
                        <h3 className="font-semibold mb-4">Avantajlar</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="h-5 w-5 text-green-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-8">
                        <h3 className="font-semibold mb-4">İşlem Süreci</h3>
                        <ol className="list-decimal list-inside space-y-2">
                          {service.process.map((step, idx) => (
                            <li key={idx} className="text-gray-600">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <Accordion type="single" collapsible className="mb-8">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <HelpCircle className="h-5 w-5" />
                          Sık Sorulan Sorular
                        </h3>
                        {service.faqs.map((faq, idx) => {
                          const [question, answer] = faq.split("|");
                          return (
                            <AccordionItem key={idx} value={`item-${idx}`}>
                              <AccordionTrigger>{question}</AccordionTrigger>
                              <AccordionContent>{answer}</AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>

                      <Link href={`/randevu?service=${service.slug}`}>
                        <Button size="lg" className="w-full">
                          Randevu Al
                        </Button>
                      </Link>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}