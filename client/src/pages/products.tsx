import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Sprout, Pill, FlaskConical, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Metadata } from "@/components/ui/metadata";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// Product categories structure
const categories = [
  {
    id: "all",
    title: "Tüm Ürünler",
    description: "Tüm VitHair ürünleri",
    icon: Package
  },
  {
    id: "monthly-sets",
    title: "Monthly Sets",
    description: "Aylık bakım setleri",
    icon: Package
  },
  {
    id: "shampoo-and-foam",
    title: "Shampoo and Foam",
    description: "Şampuan ve köpük ürünleri",
    icon: Package
  },
  {
    id: "spray",
    title: "Spray",
    description: "Sprey ürünleri",
    icon: Sprout
  },
  {
    id: "tablet",
    title: "Tablet",
    description: "Tablet ürünleri",
    icon: Pill
  },
  {
    id: "mesotherapy-and-prp",
    title: "Mesotherapy and PRP",
    description: "Mezoterapi ve PRP ürünleri",
    icon: FlaskConical
  }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  // Filter products by category
  const getProductsByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return products;
    }
    return products.filter((product: any) => {
      const normalizedCategory = product.category.toLowerCase().replace(/\s+/g, '-');
      return normalizedCategory === categoryId;
    });
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Metadata
        title="VitHair Products"
        description="VitHair profesyonel saç bakım ürünleri"
        keywords="vithair, saç bakım, şampuan, sprey, tablet, mezoterapi"
      />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-b from-primary/5 to-transparent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
              VitHair Profesyonel Saç Bakım Ürünleri
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 px-4">
              Saç sağlığınız için geliştirilmiş profesyonel çözümler
            </p>

            {/* Search - Mobile Optimized */}
            <div className="flex gap-3 max-w-md mx-auto px-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ürün ara..."
                  className="pl-10 h-10 md:h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section - Mobile Optimized */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <Tabs defaultValue="all" className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-3 md:py-4 border-b">
            <TabsList className="flex flex-nowrap overflow-x-auto gap-2 p-1 w-full justify-start md:justify-center md:flex-wrap scrollbar-none">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary flex items-center gap-2 whitespace-nowrap px-3 py-1.5"
                >
                  <category.icon className="h-4 w-4" />
                  <span className="text-sm">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
                {getProductsByCategory(category.id)
                  .filter((product: any) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product: any) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-3 md:p-4 flex flex-col h-full">
                              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-3 md:mb-4">
                                <img
                                  src={product.images?.[0]}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Badge variant="secondary" className="text-xs mb-2">
                                  {product.category}
                                </Badge>
                                <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                                  {product.name}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl p-0">
                          <DialogHeader className="p-4 md:p-6 border-b">
                            <DialogTitle className="text-lg md:text-xl">{product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                            <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 md:p-8">
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="space-y-4 md:space-y-6">
                              <div>
                                <p className="text-sm md:text-base text-muted-foreground mb-4">
                                  {product.description}
                                </p>
                              </div>

                              {/* Faydalar */}
                              {product.benefits && product.benefits.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2 md:mb-3 text-base md:text-lg">
                                    Faydaları
                                  </h4>
                                  <ul className="grid gap-2">
                                    {product.benefits.map((benefit: string, idx: number) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Kullanım Talimatları */}
                              {product.usage_instructions && product.usage_instructions.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2 md:mb-3 text-base md:text-lg">
                                    Kullanım Talimatları
                                  </h4>
                                  <ul className="grid gap-2">
                                    {product.usage_instructions.map((instruction: string, idx: number) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                        <span>{instruction}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
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