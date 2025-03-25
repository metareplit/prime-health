import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Search, Package, Sprout, Pill, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

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
  const { t } = useTranslation('common');

  // Fetch products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
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
              VitHair Profesyonel Saç Bakım Ürünleri
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Saç sağlığınız için geliştirilmiş profesyonel çözümler
            </p>

            {/* Search */}
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

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 border-b">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
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
                          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-4">
                                <img
                                  src={product.images?.[0]}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="space-y-2">
                                <Badge variant="secondary" className="text-xs">
                                  {product.category}
                                </Badge>
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                                <p className="font-semibold text-primary">
                                  {product.price?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
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
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="space-y-6">
                              <div>
                                <p className="text-muted-foreground mb-4">
                                  {product.description}
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                  {product.price?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </p>
                              </div>

                              {product.specifications && (
                                <div>
                                  <h4 className="font-semibold mb-3">Ürün Detayları</h4>
                                  <ul className="grid gap-2">
                                    {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                                      <li key={key} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">{key}:</span> {value}
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