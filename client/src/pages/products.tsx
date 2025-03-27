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
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', currentLanguage],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const products = await response.json();
      
      // Ürün isimlerini ve açıklamalarını dilin durumuna göre güncelle
      return products.map((product: any) => {
        // Ürün isimlerini dillere göre map'leme
        const productNames: Record<string, Record<string, string>> = {
          "VitHair 3 Month Set": {
            tr: "VitHair 3 Aylık Set",
            en: "VitHair 3 Month Set",
            ru: "VitHair Набор на 3 месяца",
            ka: "VitHair 3 თვის ნაკრები"
          },
          "VitHair 6 Month Set": {
            tr: "VitHair 6 Aylık Set",
            en: "VitHair 6 Month Set",
            ru: "VitHair Набор на 6 месяцев",
            ka: "VitHair 6 თვის ნაკრები"
          },
          "VitHair Anti Hair Loss Shampoo": {
            tr: "VitHair Saç Dökülmesine Karşı Şampuan",
            en: "VitHair Anti Hair Loss Shampoo",
            ru: "VitHair Шампунь против выпадения волос",
            ka: "VitHair თმის ცვენის საწინააღმდეგო შამპუნი"
          },
          "VitHair Advanced ANTI LOSS Hair Growth Foam": {
            tr: "VitHair Gelişmiş Saç Büyütme Köpüğü",
            en: "VitHair Advanced Hair Growth Foam",
            ru: "VitHair Пена для роста волос",
            ka: "VitHair გაძლიერებული თმის ზრდის ქაფი"
          },
          "VitHair Anti Hair Loss Shampoo and Care Foam Double Set": {
            tr: "VitHair Şampuan ve Bakım Köpüğü İkili Set",
            en: "VitHair Shampoo and Care Foam Double Set",
            ru: "VitHair Двойной набор шампунь и пена",
            ka: "VitHair შამპუნისა და მოვლის ქაფის ორმაგი ნაკრები"
          },
          "VitHair Serum Spray 50 ml": {
            tr: "VitHair Serum Sprey 50 ml",
            en: "VitHair Serum Spray 50 ml",
            ru: "VitHair Спрей-сыворотка 50 мл",
            ka: "VitHair შრატის სპრეი 50 მლ"
          },
          "VitHair 60 Tablet - (Biotin Multivitamins and Minerals)": {
            tr: "VitHair 60 Tablet - (Biotin Multivitamin ve Mineraller)",
            en: "VitHair 60 Tablet - (Biotin Multivitamins and Minerals)",
            ru: "VitHair 60 Таблеток - (Биотин Мультивитамины и Минералы)",
            ka: "VitHair 60 ტაბლეტი - (ბიოტინი მულტივიტამინები და მინერალები)"
          },
          "VitHair PRP": {
            tr: "VitHair PRP",
            en: "VitHair PRP",
            ru: "VitHair PRP",
            ka: "VitHair PRP"
          },
          "VitHair Mesotherapy Serum": {
            tr: "VitHair Mezoterapi Serumu",
            en: "VitHair Mesotherapy Serum",
            ru: "VitHair Сыворотка для мезотерапии",
            ka: "VitHair მეზოთერაპიის შრატი"
          }
        };
        
        // Ürün açıklamalarını dillere göre map'leme
        const productDescriptions: Record<string, Record<string, string>> = {
          "3 aylık saç bakım ve güçlendirme seti": {
            tr: "3 aylık saç bakım ve güçlendirme seti",
            en: "3-month hair care and strengthening set",
            ru: "Набор для ухода и укрепления волос на 3 месяца",
            ka: "3 თვის თმის მოვლისა და გაძლიერების ნაკრები"
          },
          "6 aylık saç bakım ve güçlendirme seti": {
            tr: "6 aylık saç bakım ve güçlendirme seti",
            en: "6-month hair care and strengthening set",
            ru: "Набор для ухода и укрепления волос на 6 месяцев",
            ka: "6 თვის თმის მოვლისა და გაძლიერების ნაკრები"
          },
          "Saç dökülmesini önleyici ve saç uzamasını hızlandırıcı özel formüllü şampuan (300ml)": {
            tr: "Saç dökülmesini önleyici ve saç uzamasını hızlandırıcı özel formüllü şampuan (300ml)",
            en: "Special formula shampoo that prevents hair loss and accelerates hair growth (300ml)",
            ru: "Шампунь специальной формулы, предотвращающий выпадение волос и ускоряющий их рост (300 мл)",
            ka: "სპეციალური ფორმულის შამპუნი, რომელიც ხელს უშლის თმის ცვენას და აჩქარებს თმის ზრდას (300მლ)"
          },
          "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici köpük (150ml)": {
            tr: "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici köpük (150ml)",
            en: "Foam that accelerates hair growth and prevents hair loss (150ml)",
            ru: "Пена, ускоряющая рост волос и предотвращающая их выпадение (150 мл)",
            ka: "ქაფი, რომელიც აჩქარებს თმის ზრდას და ხელს უშლის თმის ცვენას (150მლ)"
          },
          "Anti Hair Loss Şampuan ve Saç Bakım Köpüğü çift ürün seti": {
            tr: "Anti Hair Loss Şampuan ve Saç Bakım Köpüğü çift ürün seti",
            en: "Anti Hair Loss Shampoo and Hair Care Foam dual product set",
            ru: "Набор из двух продуктов: шампунь против выпадения волос и пена для ухода за волосами",
            ka: "თმის ცვენის საწინააღმდეგო შამპუნისა და თმის მოვლის ქაფის ორმაგი პროდუქტის ნაკრები"
          },
          "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici özel formüllü sprey": {
            tr: "Saç uzamasını hızlandırıcı ve saç dökülmesini önleyici özel formüllü sprey",
            en: "Special formula spray that accelerates hair growth and prevents hair loss",
            ru: "Спрей специальной формулы, ускоряющий рост волос и предотвращающий их выпадение",
            ka: "სპეციალური ფორმულის სპრეი, რომელიც აჩქარებს თმის ზრდას და ხელს უშლის თმის ცვენას"
          },
          "Saç büyümesini destekleyen biotin, multivitamin ve mineral içerikli takviye tablet": {
            tr: "Saç büyümesini destekleyen biotin, multivitamin ve mineral içerikli takviye tablet",
            en: "Supplement tablet containing biotin, multivitamins and minerals that support hair growth",
            ru: "Биологически активная добавка с биотином, мультивитаминами и минералами, способствующими росту волос",
            ka: "საკვები დანამატი ტაბლეტი, რომელიც შეიცავს ბიოტინს, მულტივიტამინებსა და მინერალებს, რომლებიც ხელს უწყობს თმის ზრდას"
          },
          "Saç büyümesini destekleyen özel PRP çözümü": {
            tr: "Saç büyümesini destekleyen özel PRP çözümü",
            en: "Special PRP solution that supports hair growth",
            ru: "Специальный PRP-раствор, способствующий росту волос",
            ka: "სპეციალური PRP გადაწყვეტილება, რომელიც ხელს უწყობს თმის ზრდას"
          },
          "Saç büyümesini destekleyen mezoterapi serumu": {
            tr: "Saç büyümesini destekleyen mezoterapi serumu",
            en: "Mesotherapy serum that supports hair growth",
            ru: "Сыворотка для мезотерапии, способствующая росту волос",
            ka: "მეზოთერაპიის შრატი, რომელიც ხელს უწყობს თმის ზრდას"
          }
        };

        // Ürün adını içeren bir JSON objesi varsa o ismi kullan, aksi takdirde originalini kullan
        let productName = product.name;
        const nameObj = Object.entries(productNames).find(([key]) => {
          return product.name === key;
        });
        
        if (nameObj && nameObj[1] && currentLanguage in nameObj[1]) {
          productName = nameObj[1][currentLanguage as keyof typeof nameObj[1]];
        }
        
        // Ürün açıklamasını içeren bir JSON objesi varsa o açıklamayı kullan, aksi takdirde originalini kullan
        let productDescription = product.description;
        const descObj = Object.entries(productDescriptions).find(([key]) => {
          return product.description === key;
        });
        
        if (descObj && descObj[1] && currentLanguage in descObj[1]) {
          productDescription = descObj[1][currentLanguage as keyof typeof descObj[1]];
        }
        
        return {
          ...product,
          name: productName,
          description: productDescription
        };
      });
    }
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
            <TabsList className="w-full h-auto flex items-center justify-start gap-2 p-4 overflow-x-auto hide-scrollbar">
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
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
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
            
            {product.specifications && (
              <div className="pt-2 space-y-1">
                <p className="text-xs font-medium text-primary">{t('products.product.ingredients')}</p>
                <p className="text-xs text-muted-foreground">
                  {product.specifications['İçerik'] || product.specifications['Volume'] || '-'}
                </p>
                
                {product.specifications['Saç Tipi'] && (
                  <>
                    <p className="text-xs font-medium text-primary mt-2">{t('products.product.hairTypes.all')}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.specifications['Saç Tipi']}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}