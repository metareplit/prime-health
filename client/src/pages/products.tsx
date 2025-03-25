import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle, Droplet, Clock, Search } from "lucide-react";
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
    titleKey: "Hepsi",
    descriptionKey: "Tüm Ürünler",
  },
  {
    id: "monthly-sets",
    titleKey: "Monthly Sets",
    descriptionKey: "Aylık Bakım Setleri",
  },
  {
    id: "shampoo-foam",
    titleKey: "Shampoo and Foam",
    descriptionKey: "Şampuan ve Köpük Ürünleri",
  },
  {
    id: "spray",
    titleKey: "Spray",
    descriptionKey: "Sprey Ürünleri",
  },
  {
    id: "tablet",
    titleKey: "Tablet",
    descriptionKey: "Tablet Ürünleri",
  },
  {
    id: "mesotherapy",
    titleKey: "Mesotherapy and PRP",
    descriptionKey: "Mezoterapi ve PRP Ürünleri",
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
      console.log('Fetched products:', data);
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
        title={t('products.title')}
        description={t('products.subtitle')}
        keywords="saç bakım ürünleri, şampuan, sprey, tablet, mezoterapi"
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
              {t('products.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('products.subtitle')}
            </p>

            {/* Arama ve Filtreleme */}
            <div className="flex gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('products.search')}
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
        <Tabs defaultValue="all" className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 border-b">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary"
                >
                  {category.titleKey}
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
                                  src={product.images?.[0] || `/images/products/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}.webp`}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {product.category}
                                  </Badge>
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
                                src={product.images?.[0] || `/images/products/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}.webp`}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="space-y-6">
                              <div>
                                <p className="text-muted-foreground">
                                  {product.long_description || product.description}
                                </p>
                              </div>

                              {product.specifications && (
                                <div>
                                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                                    <Droplet className="h-5 w-5 text-primary" />
                                    {t('products.product.ingredients')}
                                  </h4>
                                  <ul className="grid grid-cols-2 gap-2">
                                    {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                                      <li key={key} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {value}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {product.benefits && (
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="benefits">
                                    <AccordionTrigger>
                                      <span className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        {t('products.product.benefits')}
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="space-y-2">
                                        {product.benefits.map((benefit: string, idx: number) => (
                                          <li key={idx} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            {benefit}
                                          </li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
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