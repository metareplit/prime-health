import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle, Droplet, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Metadata } from "@/components/ui/metadata";

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
      {
        id: 2,
        name: "Keratin Onarıcı Şampuan",
        description: "Yıpranmış saçlar için keratin protein kompleksi içeren özel formül",
        image: "/images/products/shampoo-2.svg",
        hairType: ["Kuru", "Yıpranmış"],
        usagePhase: "Saç ekimi sonrası 1. aydan itibaren",
        ingredients: [
          "Keratin Kompleksi",
          "Silk Protein",
          "Argan Yağı",
          "Jojoba Yağı",
          "B5 Vitamini",
          "Collagen"
        ],
        benefits: [
          "Saç tellerini onarır",
          "Kırılmaları önler",
          "Yumuşaklık sağlar",
          "Elektriklenmeyi azaltır"
        ],
        instructions: [
          "Saçı iyice ıslatın",
          "Şampuanı saç boyuna uygulayın",
          "3-4 dakika bekletin",
          "Detaylıca durulayın"
        ],
        warnings: [
          "Saç derisi hassasiyeti durumunda kullanmayın",
          "Çocuklardan uzak tutun",
          "Göz ile temasından kaçının"
        ]
      },
      {
        id: 3,
        name: "Kafein Kompleks Şampuan",
        description: "Saç büyümesini hızlandıran kafein ve bitki özleri içeren formül",
        image: "/images/products/shampoo-3.svg",
        hairType: ["Tüm Saç Tipleri"],
        usagePhase: "Saç ekimi sonrası 3. haftadan itibaren",
        ingredients: [
          "Kafein",
          "Saw Palmetto",
          "Biberiye Özü",
          "Ginseng",
          "Biotin",
          "Niacinamide"
        ],
        benefits: [
          "Saç büyümesini uyarır",
          "Kan dolaşımını artırır",
          "Saç köklerini besler",
          "DHT blokeri etkisi gösterir"
        ],
        instructions: [
          "Günlük kullanım için uygundur",
          "Saç derisine masaj yaparak uygulayın",
          "2 dakika bekletin",
          "İyice durulayın"
        ],
        warnings: [
          "Kafeine hassasiyeti olanlar kullanmamalıdır",
          "Açık yaralara uygulamayın",
          "Doktor kontrolünde kullanın"
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
      {
        id: 2,
        name: "Yoğun Bakım Serum",
        description: "Saç köklerini besleyen ve güçlendiren yoğun bakım serumu",
        image: "/images/products/serum-2.svg",
        hairType: ["İnce Telli", "Zayıf"],
        usagePhase: "Saç ekimi sonrası 2. aydan itibaren",
        ingredients: [
          "Keratinöz Peptitler",
          "Collagen",
          "B5 Vitamini",
          "E Vitamini",
          "Argan Yağı"
        ],
        benefits: [
          "Saç tellerini kalınlaştırır",
          "Kırılmaları önler",
          "Parlaklık sağlar",
          "Saç yapısını güçlendirir"
        ],
        instructions: [
          "Akşam uygulanması önerilir",
          "4-5 damla kullanın",
          "Saç diplerine masaj yapın",
          "Durulamayın"
        ],
        warnings: [
          "Yalnızca harici kullanım içindir",
          "Güneş ışığından koruyun",
          "Aşırı kullanımdan kaçının"
        ]
      },
      {
        id: 3,
        name: "Canlandırıcı Saç Serumu",
        description: "Doğal bitki özleri ile saç derisini canlandıran serum",
        image: "/images/products/serum-3.svg",
        hairType: ["Hassas", "Yıpranmış"],
        usagePhase: "Saç ekimi sonrası 3. aydan itibaren",
        ingredients: [
          "Biberiye Özü",
          "Aloe Vera",
          "Mentol",
          "Kafein",
          "Panthenol"
        ],
        benefits: [
          "Saç derisini canlandırır",
          "Serinletici etki sağlar",
          "Kaşıntıyı azaltır",
          "Saç büyümesini destekler"
        ],
        instructions: [
          "Sabah ve akşam uygulayın",
          "Saç derisine masaj yapın",
          "5 dakika bekletin",
          "Durulamayın"
        ],
        warnings: [
          "Hassas ciltlerde test edilmeli",
          "Göz çevresine uygulamayın",
          "Tahriş durumunda kullanmayın"
        ]
      }
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
    <div className="min-h-screen bg-background">
      <Metadata
        title="Profesyonel Saç Bakım Ürünleri | Hair Clinic"
        description="Saç ekimi sonrası özel bakım ürünleri. Profesyonel saç bakım ürünleri hakkında detaylı bilgi ve kullanım talimatları."
        keywords="saç bakım ürünleri, saç ekimi şampuanı, saç serumu, saç vitamini"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Profesyonel Saç Bakım Ürünleri
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Saç ekimi sonrası en iyi sonucu almak için özel olarak formüle edilmiş ürünler
            </p>

            {/* Arama ve Filtreleme */}
            <div className="flex gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ürün ara..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ürünler Section */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="sampuanlar" className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 border-b">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {productCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {productCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {category.products
                  .filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  {product.hairType.map((type) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="space-y-6">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {product.usagePhase}
                                </Badge>
                                <p className="text-muted-foreground">
                                  {product.description}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-3">
                                  <Droplet className="h-5 w-5 text-primary" />
                                  İçerik Maddeleri
                                </h4>
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
                                    <ul className="space-y-2">
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

                                <AccordionItem value="warnings">
                                  <AccordionTrigger>
                                    <span className="flex items-center gap-2">
                                      <AlertCircle className="h-5 w-5 text-primary" />
                                      Uyarılar
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="space-y-2">
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
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}