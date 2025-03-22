import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle, Droplet, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Metadata } from "@/components/ui/metadata";

// Ürün kategorileri ve ürünler
const productCategories = [
  {
    id: "sampuanlar",
    title: "Saç Bakım Şampuanları",
    description: "Saç ekimi sonrası özel olarak formüle edilmiş şampuanlar",
    products: [
      {
        id: 1,
        name: "Biotin Güçlendirici Şampuan",
        description: "Saç ekimi sonrası kullanım için özel olarak geliştirilmiş biotin içerikli şampuan",
        image: "/images/products/shampoo-1.svg",
        hairType: ["Yağlı", "Normal", "Karma"],
        usagePhase: "Saç ekimi sonrası 15. günden itibaren",
        ingredients: [
          "Biotin",
          "Keratin",
          "Panthenol",
          "Aloe Vera",
          "E Vitamini",
          "Argan Yağı"
        ],
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
          "2-3 dakika bekletin",
          "İyice durulayın"
        ],
        warnings: [
          "Göz ile temasından kaçının",
          "Yalnızca harici kullanım içindir",
          "Tahriş durumunda kullanımı bırakın"
        ]
      },
      // 5 adet daha şampuan eklenecek...
    ]
  },
  {
    id: "serumlar",
    title: "Saç Büyütme Serumları",
    description: "Saç büyümesini destekleyen özel serumlar",
    products: [
      {
        id: 1,
        name: "Peptit Kompleks Serum",
        description: "Saç büyümesini hızlandıran ve güçlendiren peptit bazlı serum",
        image: "/images/products/serum-1.svg",
        hairType: ["Tüm Saç Tipleri"],
        usagePhase: "Saç ekimi sonrası 1. aydan itibaren",
        ingredients: [
          "Peptitler",
          "Biotin",
          "Kafein",
          "Ginseng Özü",
          "Hyaluronik Asit"
        ],
        benefits: [
          "Saç büyümesini uyarır",
          "Saç köklerini güçlendirir",
          "Kan dolaşımını artırır",
          "Saç dökülmesini azaltır"
        ],
        instructions: [
          "Temiz saç derisine uygulayın",
          "Her bölgeye 2-3 damla damlatın",
          "Nazikçe masaj yapın",
          "Günde 1-2 kez uygulayın"
        ],
        warnings: [
          "Hamilelik ve emzirme döneminde kullanmayın",
          "Alerjik reaksiyon durumunda kullanımı bırakın",
          "Gözle temastan kaçının"
        ]
      },
      // 5 adet daha serum eklenecek...
    ]
  },
  {
    id: "maskeler",
    title: "Saç Bakım Maskeleri",
    description: "Yoğun bakım ve onarım sağlayan maskeler",
    products: [
      // 6 adet maske eklenecek...
    ]
  },
  {
    id: "vitaminler",
    title: "Saç Bakım Vitaminleri",
    description: "Saç sağlığını içten destekleyen vitamin takviyeleri",
    products: [
      // 6 adet vitamin eklenecek...
    ]
  },
  {
    id: "tonikler",
    title: "Saç Bakım Tonikleri",
    description: "Saç derisini canlandıran ve besleyen tonikler",
    products: [
      // 6 adet tonik eklenecek...
    ]
  },
  {
    id: "kremler",
    title: "Saç Bakım Kremleri",
    description: "Günlük bakım ve nemlendirme için kremler",
    products: [
      // 6 adet krem eklenecek...
    ]
  }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHairType, setSelectedHairType] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);

  return (
    <div className="min-h-screen">
      <Metadata
        title="Profesyonel Saç Bakım Ürünleri ve Kullanım Kılavuzu | Hair Clinic"
        description="Saç ekimi sonrası bakım ürünleri, şampuanlar, serumlar, maskeler ve vitaminler. Profesyonel saç bakım ürünleri hakkında detaylı bilgi ve kullanım talimatları."
        keywords="saç bakım ürünleri, saç ekimi şampuanı, saç serumu, saç vitamini, saç bakım maskesi, saç toniği, saç kremi"
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -right-40 -top-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -left-40 -bottom-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Profesyonel Saç Bakım Ürünleri
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Saç ekimi sonrası en iyi sonucu almak için özel olarak formüle edilmiş ürünler
            </p>

            {/* Arama ve Filtreleme */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Ürün ara..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => setSelectedHairType([])}
                >
                  Saç Tipi
                  {selectedHairType.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedHairType.length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => setSelectedPhase([])}
                >
                  Kullanım Zamanı
                  {selectedPhase.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedPhase.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="sampuanlar" className="w-full">
          <TabsList className="flex flex-wrap justify-center mb-8 gap-2">
            {productCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary/90"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {productCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-8">
                {category.products
                  .filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .filter(product => 
                    selectedHairType.length === 0 || 
                    product.hairType.some(type => selectedHairType.includes(type))
                  )
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="p-6">
                            <CardHeader className="p-0 mb-6">
                              <div className="flex flex-wrap gap-2 mb-3">
                                {product.hairType.map((type) => (
                                  <Badge key={type} variant="secondary">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                              <CardTitle className="text-2xl">{product.name}</CardTitle>
                              <p className="text-gray-600 mt-2">{product.description}</p>
                            </CardHeader>
                            <CardContent className="p-0">
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

                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="benefits">
                                    <AccordionTrigger>
                                      <span className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        Faydaları
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="space-y-2 mt-2">
                                        {product.benefits.map((benefit, idx) => (
                                          <li key={idx} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            {benefit}
                                          </li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>

                                  <AccordionItem value="instructions">
                                    <AccordionTrigger>
                                      <span className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Kullanım Talimatları
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-4 mt-2">
                                        <div>
                                          <Badge variant="outline" className="mb-2">
                                            {product.usagePhase}
                                          </Badge>
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
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>

                                  <AccordionItem value="warnings">
                                    <AccordionTrigger>
                                      <span className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-primary" />
                                        Uyarılar
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="space-y-2 mt-2">
                                        {product.warnings.map((warning, idx) => (
                                          <li key={idx} className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {warning}
                                          </li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
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