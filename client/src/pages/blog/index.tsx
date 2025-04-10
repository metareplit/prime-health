import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Metadata } from "@/components/ui/metadata";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Blog kategorileri
const categories = [
  "all",
  "hairTransplant",
  "beardTransplant",
  "eyebrowTransplant",
  "aftercare",
  "treatment"
];

// Blog yazıları
const blogPosts = [
  {
    id: 1,
    title: "Saç Ekimi Öncesi Dikkat Edilmesi Gerekenler",
    description: "Saç ekimi operasyonu öncesinde bilmeniz gereken önemli noktalar ve hazırlık süreci hakkında detaylı bilgiler.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    category: "hairTransplant",
    author: "Dr. Ahmet Yılmaz",
    date: "2024-03-15",
    readTime: "8 dk",
    slug: "sac-ekimi-oncesi-dikkat-edilmesi-gerekenler",
    tags: ["Saç Ekimi", "Hazırlık", "Tedavi"]
  },
  {
    id: 2,
    title: "DHI ve Safir FUE Teknikleri Arasındaki Farklar",
    description: "Modern saç ekimi teknikleri olan DHI ve Safir FUE yöntemlerinin karşılaştırmalı analizi ve hangi durumda hangi tekniğin tercih edilmesi gerektiği.",
    image: "https://images.unsplash.com/photo-1598264294394-ba29cf557627",
    category: "hairTransplant",
    author: "Dr. Mehmet Kaya",
    date: "2024-03-10",
    readTime: "10 dk",
    slug: "dhi-ve-safir-fue-teknikleri-arasindaki-farklar",
    tags: ["DHI", "Safir FUE", "Teknikler"]
  },
  {
    id: 3,
    title: "Sakal Ekiminde Doğal Görünüm Nasıl Sağlanır?",
    description: "Sakal ekimi operasyonlarında doğal görünümün sağlanması için dikkat edilmesi gereken teknik detaylar ve planlama süreci.",
    image: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8",
    category: "beardTransplant",
    author: "Dr. Ahmet Yılmaz",
    date: "2024-03-05",
    readTime: "7 dk",
    slug: "sakal-ekiminde-dogal-gorunum",
    tags: ["Sakal Ekimi", "Doğal Görünüm"]
  },
  {
    id: 4,
    title: "Saç Ekimi Sonrası İlk 15 Gün",
    description: "Saç ekimi operasyonu sonrası ilk 15 günlük süreçte yapılması ve yapılmaması gerekenler hakkında kapsamlı rehber.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    category: "treatment",
    author: "Dr. Mehmet Kaya",
    date: "2024-02-28",
    readTime: "12 dk",
    slug: "sac-ekimi-sonrasi-ilk-15-gun",
    tags: ["Bakım", "İyileşme Süreci"]
  },
  {
    id: 5,
    title: "Kaş Ekimi için Doğru Zaman Ne Zaman?",
    description: "Kaş ekimi operasyonu için en uygun zamanın belirlenmesi ve operasyon öncesi değerlendirme süreci hakkında bilgiler.",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec",
    category: "eyebrowTransplant",
    author: "Dr. Ayşe Demir",
    date: "2024-02-20",
    readTime: "6 dk",
    slug: "kas-ekimi-icin-dogru-zaman",
    tags: ["Kaş Ekimi", "Planlama"]
  }
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { t } = useTranslation('common');

  // Filtreleme fonksiyonu
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Metadata
        title={t('blog.title')}
        description={t('blog.subtitle')}
        keywords="saç ekimi blog, sakal ekimi makaleler, estetik tedavi blog, saç ekimi tecrübeleri"
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
              {t('blog.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('blog.subtitle')}
            </p>

            {/* Arama */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('blog.search')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 border-b">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="data-[state=active]:bg-primary"
                >
                  {t(`blog.categories.${category}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-0">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <Badge className="absolute top-4 left-4">
                            {t(`blog.categories.${post.category}`)}
                          </Badge>
                        </div>
                        <div className="p-6 space-y-4">
                          <CardHeader className="p-0">
                            <CardTitle className="text-xl mb-2 line-clamp-2">
                              {post.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.description}
                            </p>
                          </CardHeader>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>

                          <Button variant="link" className="p-0 h-auto">
                            {t('buttons.readMore')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}