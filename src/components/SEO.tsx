import Head from "next/head";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
};

export default function SEO({
  title,
  description,
  keywords,
  image = "https://www.vakropharma.com/assets/vakroallproducts.jpeg",
  url = "https://www.vakropharma.com",
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      {keywords && <meta name="keywords" content={keywords} />}

      <meta name="robots" content="index, follow" />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Vakro Pharma" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Head>
  );
}