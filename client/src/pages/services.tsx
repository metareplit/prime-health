import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Check, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Service } from "@shared/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Services() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary/5 py-20 mb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Profesyonel Saç Ekimi ve Estetik Hizmetleri
            </h1>
            <p className="text-xl text-gray-600">
              Modern teknoloji ve uzman kadromuzla doğal ve kalıcı sonuçlar için yanınızdayız
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-12"
          >
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                className="group"
              >
                <Card id={service.slug} className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover rounded-l-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <CardTitle className="text-2xl md:text-3xl">{service.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {service.longDescription}
                        </p>

                        <div className="flex items-center gap-2 mb-6 text-primary">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">{service.duration}</span>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>Avantajlar</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.benefits.map((benefit, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">İşlem Süreci</h3>
                          <ol className="space-y-4">
                            {service.process.map((step, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                              </motion.li>
                            ))}
                          </ol>
                        </div>

                        <Accordion type="single" collapsible className="mb-8">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <HelpCircle className="h-6 w-6 text-primary" />
                            <span>Sık Sorulan Sorular</span>
                          </h3>
                          {service.faqs.map((faq, idx) => {
                            const [question, answer] = faq.split("|");
                            return (
                              <AccordionItem 
                                key={idx} 
                                value={`item-${idx}`}
                                className="border rounded-lg mb-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                              >
                                <AccordionTrigger className="text-left">
                                  {question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                  {answer}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>

                        <Link href={`/randevu?service=${service.slug}`}>
                          <Button 
                            size="lg" 
                            className="w-full group hover:translate-y-[-2px] transition-all duration-300"
                          >
                            <span>Randevu Al</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}