import { Helmet } from "react-helmet";

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export function Metadata({ 
  title, 
  description, 
  keywords = "", 
  image = "/logo.png",
  type = "website" 
}: MetadataProps) {
  const siteTitle = "Modern Saç Ekimi & Estetik Kliniği";
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}