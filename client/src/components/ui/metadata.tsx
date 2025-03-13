import { Helmet } from "react-helmet";

interface MetadataProps {
  title: string;
  description: string;
  keywords: string;
}

export function Metadata({ title, description, keywords }: MetadataProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
