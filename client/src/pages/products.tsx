import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Sprout, Pill, FlaskConical, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Metadata } from "@/components/ui/metadata";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const getCategoryIcons = () => {
  return {
    "all": Package,
    "monthly-sets": Package,
    "shampoo-and-foam": Package,
    "spray": Sprout,
    "tablet": Pill,
    "mesotherapy-and-prp": FlaskConical
  };
};

// Mock data for testing without backend
const mockProducts = [
  {
    id: 1,
    name: "VitHair 3 Month Set",
    description: "3 aylık saç bakım ve güçlendirme seti",
    category: "monthly-sets",
    image: "/images/products/monthly-sets/vithair-3-month-set.webp",
    price: 299.99,
    features: ["Saç dökülmesini önler", "Saç büyümesini hızlandırır", "Saç köklerini güçlendirir"]
  },
  {
    id: 2,
    name: "VitHair 6 Month Set",
    description: "6 aylık saç bakım ve güçlendirme seti",
    category: "monthly-sets",
    image: "/images/products/monthly-sets/vithair-6-month-set.webp",
    price: 549.99,
    features: ["Saç dökülmesini önler", "Saç büyümesini hızlandırır", "Saç köklerini güçlendirir"]
  },
  {
    id: 3,
    name: "VitHair Anti Hair Loss Shampoo",
    description: "Saç dökülmesini önleyici ve saç uzamasını hızlandırıcı özel formüllü şampuan (300ml)",
    category: "shampoo-and-foam",
    image: "/images/products/shampoo-and-foam/vithair-anti-loss-shampoo.webp",
    price: 89.99,
    features: ["Saç dökülmesini önler", "Saç büyümesini hızlandırır", "Saç derisini besler"]
  },
  {
    id: 4,
    name: "VitHair Advanced ANTI LOSS Hair Growth Foam",
    description: "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici köpük (150ml)",
    category: "shampoo-and-foam",
    image: "/images/products/shampoo-and-foam/vithair-anti-loss-foam.webp",
    price: 79.99,
    features: ["Saç dökülmesini önler", "Saç büyümesini hızlandırır", "Kolay uygulama"]
  },
  {
    id: 5,
    name: "VitHair Serum Spray 50 ml",
    description: "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici özel formüllü sprey",
    category: "spray",
    image: "/images/products/spray/vithair-serum-spray.webp",
    price: 69.99,
    features: ["Saç dökülmesini önler", "Saç büyümesini hızlandırır", "Hızlı emilim"]
  },
  {
    id: 6,
    name: "VitHair 60 Tablet",
    description: "Saç büyümesini destekleyen biotin, multivitamin ve mineral içerikli takviye tablet",
    category: "tablet",
    image: "/images/products/tablet/vithair-biotin-tablet.webp",
    price: 129.99,
    features: ["Biotin içerir", "Multivitamin ve mineral desteği", "Günlük kullanım"]
  },
  {
    id: 7,
    name: "VitHair PRP",
    description: "Saç büyümesini destekleyen özel PRP çözümü",
    category: "mesotherapy-and-prp",
    image: "/images/products/mesotherapy/vithair-prp.webp",
    price: 199.99,
    features: ["PRP tedavisi", "Saç köklerini güçlendirir", "Profesyonel kullanım"]
  },
  {
    id: 8,
    name: "VitHair Mesotherapy Serum",
    description: "Saç büyümesini destekleyen mezoterapi serumu",
    category: "mesotherapy-and-prp",
    image: "/images/products/mesotherapy/vithair-mesotherapy.webp",
    price: 179.99,
    features: ["Mezoterapi tedavisi", "Saç köklerini besler", "Profesyonel kullanım"]
  }
];

export default function Products() {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Kategori listesini dile göre oluştur
  const categories = [
    {
      id: "all",
      title: t('products.categories.all.title'),
      shortTitle: t('products.categories.all.shortTitle'),
      description: t('products.categories.all.description'),
      icon: getCategoryIcons().all,
      color: "bg-purple-500"
    },
    {
      id: "monthly-sets",
      title: t('products.categories.monthlySets.title'),
      shortTitle: t('products.categories.monthlySets.shortTitle'),
      description: t('products.categories.monthlySets.description'),
      icon: getCategoryIcons()["monthly-sets"],
      color: "bg-blue-500"
    },
    {
      id: "shampoo-and-foam",
      title: t('products.categories.shampooAndFoam.title'),
      shortTitle: t('products.categories.shampooAndFoam.shortTitle'),
      description: t('products.categories.shampooAndFoam.description'),
      icon: getCategoryIcons()["shampoo-and-foam"],
      color: "bg-green-500"
    },
    {
      id: "spray",
      title: t('products.categories.spray.title'),
      shortTitle: t('products.categories.spray.shortTitle'),
      description: t('products.categories.spray.description'),
      icon: getCategoryIcons().spray,
      color: "bg-yellow-500"
    },
    {
      id: "tablet",
      title: t('products.categories.tablet.title'),
      shortTitle: t('products.categories.tablet.shortTitle'),
      description: t('products.categories.tablet.description'),
      icon: getCategoryIcons().tablet,
      color: "bg-red-500"
    },
    {
      id: "mesotherapy-and-prp",
      title: t('products.categories.mesotherapyAndPrp.title'),
      shortTitle: t('products.categories.mesotherapyAndPrp.shortTitle'),
      description: t('products.categories.mesotherapyAndPrp.description'),
      icon: getCategoryIcons()["mesotherapy-and-prp"],
      color: "bg-indigo-500"
    }
  ];

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Use mock data instead of API call
  const { data: products = mockProducts, isLoading } = useQuery({
    queryKey: ['products', currentLanguage],
    queryFn: async () => mockProducts,
  });

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
        keywords="vithair, saç bakım, şampuan, sprey, tablet, mezoterapi"
      />

      {/* Search Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-transparent py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('products.search')}
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories and Products */}
      <section className="container mx-auto px-4">
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          {/* Categories */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm mb-8">
            <TabsList className="w-full h-auto flex items-center justify-center gap-2 p-4 overflow-x-auto hide-scrollbar">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 min-w-fit",
                    "bg-background hover:bg-muted rounded-lg transition-colors",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "border border-border data-[state=active]:border-primary"
                  )}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">
                    {isMobile ? category.shortTitle : category.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Products Grid */}
          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {getProductsByCategory(category.id)
                  .filter((product: any) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const { t } = useTranslation('common');
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Ürün kategorisini dile göre göster
  const getCategoryNameByLanguage = (category: string) => {
    const categoryMappings: Record<string, string> = {
      'monthly-sets': t('products.categories.monthlySets.shortTitle'),
      'shampoo-and-foam': t('products.categories.shampooAndFoam.shortTitle'),
      'spray': t('products.categories.spray.shortTitle'),
      'tablet': t('products.categories.tablet.shortTitle'),
      'mesotherapy-and-prp': t('products.categories.mesotherapyAndPrp.shortTitle')
    };
    
    const normalizedCategory = product.category.toLowerCase().replace(/\s+/g, '-');
    return categoryMappings[normalizedCategory] || product.category;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 h-full border-transparent hover:border-primary/20">
        <CardContent className="p-3 md:p-4 flex flex-col h-full">
          <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-3 md:mb-4 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/placeholder.webp';
              }}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Badge variant="secondary" className="text-xs mb-2">
              {getCategoryNameByLanguage(product.category)}
            </Badge>
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            {product.features && (
              <div className="pt-2 space-y-1">
                <p className="text-xs font-medium text-primary">{t('products.product.features')}</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}