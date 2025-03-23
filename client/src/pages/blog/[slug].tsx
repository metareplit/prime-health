import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

// Blog yazıları (Gerçek uygulamada API'den gelecek)
const blogPosts = [
  {
    id: 1,
    title: "Saç Ekimi Öncesi Dikkat Edilmesi Gerekenler",
    description: "Saç ekimi operasyonu öncesinde bilmeniz gereken önemli noktalar ve hazırlık süreci hakkında detaylı bilgiler.",
    content: `
      <h2>Saç Ekimi Öncesi Hazırlık</h2>
      <p>Saç ekimi operasyonu öncesinde dikkat edilmesi gereken birçok önemli nokta bulunmaktadır. Bu hazırlık süreci, operasyonun başarısını doğrudan etkileyecek faktörleri içerir.</p>

      <h3>1. Sağlık Kontrolleri</h3>
      <p>Operasyon öncesinde detaylı bir sağlık kontrolünden geçmeniz gerekmektedir. Bu kontrollerr şunları içerir:</p>
      <ul>
        <li>Kan testleri</li>
        <li>Kardiyolojik değerlendirme</li>
        <li>Genel sağlık muayenesi</li>
      </ul>

      <h3>2. İlaç Kullanımı</h3>
      <p>Operasyondan 10 gün önce kan sulandırıcı özelliği olan ilaçların kullanımı durdurulmalıdır. Düzenli kullandığınız ilaçlar varsa, doktorunuza mutlaka bilgi vermelisiniz.</p>

      <h3>3. Yaşam Tarzı Değişiklikleri</h3>
      <p>Operasyon öncesi dönemde bazı yaşam tarzı değişiklikleri yapmanız gerekebilir:</p>
      <ul>
        <li>Sigarayı bırakma veya azaltma</li>
        <li>Alkol tüketimini durdurma</li>
        <li>Sağlıklı beslenme düzenine geçiş</li>
      </ul>

      <h2>Operasyon Günü</h2>
      <p>Operasyon günü için yapmanız gerekenler:</p>
      <ul>
        <li>Aç karnına gelme</li>
        <li>Rahat kıyafetler tercih etme</li>
        <li>Düğmeli veya fermuarlı üst giysi getirme</li>
        <li>Yanınızda bir refakatçi bulundurma</li>
      </ul>
    `,
    image: "/images/blog/pre-op-care.jpg",
    category: "Saç Ekimi",
    author: {
      name: "Dr. Ahmet Yılmaz",
      title: "Saç Ekimi Uzmanı",
      image: "/images/doctors/dr-ahmet.jpg",
      bio: "15 yıllık deneyime sahip saç ekimi uzmanı"
    },
    date: "2024-03-15",
    readTime: "8 dk",
    slug: "sac-ekimi-oncesi-dikkat-edilmesi-gerekenler",
    tags: ["Saç Ekimi", "Hazırlık", "Tedavi"]
  },
  // Diğer blog yazıları...
];

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const post = blogPosts.find(post => post.slug === params?.slug);
  const { t } = useTranslation('common');

  if (!post) {
    return <div>{t('blog.search.noResults')}</div>;
  }

  // İlgili yazılar
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Metadata
        title={`${post.title} | ${t('blog.title')}`}
        description={post.description}
        keywords={post.tags.join(", ")}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {post.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <img src={post.author.image} alt={post.author.name} />
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('blog.publishDate', { date: new Date(post.date).toLocaleDateString() })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t('blog.readTime', { minutes: post.readTime })}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Featured Image */}
                <div className="aspect-video rounded-lg overflow-hidden mb-8">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Blog Content */}
                <article
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t">
                  <span className="font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    {t('social.share.title')}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label={t('social.share.facebook')}>
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label={t('social.share.twitter')}>
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label={t('social.share.linkedin')}>
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('blog.author.about')}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <img src={post.author.image} alt={post.author.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.title}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.author.bio}
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('blog.relatedPosts')}</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group cursor-pointer">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {relatedPost.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}