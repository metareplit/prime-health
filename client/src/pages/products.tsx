import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle, Droplet, Clock } from "lucide-react";
import { Metadata } from "@/components/ui/metadata";

const productCategories = [
  {
    id: "sampuanlar",
    title: "Saç Bakım Şampuanları",
    description: "Saç ekimi sonrası özel olarak formüle edilmiş şampuanlar",
    products: [
      {
        id: 1,
        name: "Özel Formül Şampuan",
        description: "Saç ekimi sonrası kullanım için özel olarak geliştirilmiş şampuan",
        image: "/images/products/shampoo-1.svg",
        ingredients: [
          "Biotin",
          "Keratin",
          "Panthenol",
          "Aloe Vera"
        ],
        usage: "Günde bir kez, nazikçe masaj yaparak uygulayın",
        benefits: [
          "Saç köklerini güçlendirir",
          "Yeni saç büyümesini destekler",
          "Saç derisini nemlendirir",
          "pH dengesini korur"
        ],
        instructions: [
          "Saçınızı ılık su ile ıslatın",
          "Az miktarda şampuan kullanın",
          "Nazikçe masaj yapın",
          "İyice durulayın"
        ],
        warnings: [
          "Göz ile temasından kaçının",
          "Yalnızca harici kullanım içindir",
          "Tahriş durumunda kullanımı bırakın"
        ]
      }
    ]
  },
  {
    id: "serumlar",
    title: "Saç Büyütme Serumları",
    description: "Saç büyümesini destekleyen özel serumlar",
    products: [
      {
        id: 1,
        name: "Saç Büyüme Serumu",
        description: "Saç büyümesini hızlandıran ve güçlendiren serum",
        image: "/images/products/serum-1.svg",
        ingredients: [
          "Minoxidil",
          "Peptitler",
          "Biotin",
          "Kafein"
        ],
        usage: "Günde iki kez, temiz saç derisine uygulayın",
        benefits: [
          "Saç büyümesini uyarır",
          "Saç dökülmesini azaltır",
          "Saç kalitesini artırır",
          "Saç köklerini besler"
        ],
        instructions: [
          "Saç derisi temiz ve kuru olmalı",
          "Damlalık ile direkt saç derisine uygulayın",
          "Nazikçe masaj yapın",
          "En az 4 saat saçınızı yıkamayın"
        ],
        warnings: [
          "Hamilelik ve emzirme döneminde kullanmayın",
          "Alerjik reaksiyon durumunda kullanımı bırakın",
          "Doktor tavsiyesi ile kullanın"
        ]
      }
    ]
  }
];

export default function Products() {
  return (
    <div className="min-h-screen">
      <Metadata
        title="Saç Bakım Ürünleri ve Kullanım Kılavuzu | Hair Clinic Tiflis"
        description="Saç ekimi sonrası bakım ürünleri, şampuanlar, serumlar ve vitaminler. Profesyonel saç bakım ürünleri hakkında detaylı bilgi."
        keywords="saç bakım ürünleri, saç ekimi şampuanı, saç serumu, saç vitamini, saç bakım kılavuzu"
      />

      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Profesyonel Saç Bakım Ürünleri
            </h1>
            <p className="text-lg text-gray-600">
              Saç ekimi sonrası en iyi sonucu almak için özel olarak formüle edilmiş ürünler
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="sampuanlar" className="w-full">
          <TabsList className="flex justify-center mb-8">
            {productCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {productCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-8">
                {category.products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative aspect-square">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-8"
                          />
                        </div>
                        <div className="p-6">
                          <CardHeader>
                            <CardTitle className="text-2xl">{product.name}</CardTitle>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                  <Droplet className="h-5 w-5 text-primary" />
                                  İçerik Maddeleri
                                </h3>
                                <ul className="grid grid-cols-2 gap-2">
                                  {product.ingredients.map((ingredient, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-500" />
                                      {ingredient}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                  <Check className="h-5 w-5 text-primary" />
                                  Faydaları
                                </h3>
                                <ul className="space-y-2">
                                  {product.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-500" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                  <Clock className="h-5 w-5 text-primary" />
                                  Kullanım Talimatları
                                </h3>
                                <Accordion type="single" collapsible>
                                  <AccordionItem value="instructions">
                                    <AccordionTrigger>Nasıl Kullanılır?</AccordionTrigger>
                                    <AccordionContent>
                                      <ol className="space-y-2">
                                        {product.instructions.map((instruction, idx) => (
                                          <li key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                                              {idx + 1}
                                            </span>
                                            {instruction}
                                          </li>
                                        ))}
                                      </ol>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>

                              <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                  <AlertCircle className="h-5 w-5 text-primary" />
                                  Uyarılar
                                </h3>
                                <ul className="space-y-2">
                                  {product.warnings.map((warning, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-red-600">
                                      <AlertCircle className="h-4 w-4" />
                                      {warning}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
