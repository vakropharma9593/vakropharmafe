import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import ProductPage from "@/components/ProductPage";
import { productData, ProductUIData } from "@/lib/productData";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductPageProps = {
  product: {
    _id: string;
    name: string;
    mrp: number;
    description?: string;
    slug: string;
  };
};

type ProductSlug = keyof typeof productData;

const ProductSlugPage = ({ product }: ProductPageProps) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
  ? router.query.slug[0]
  : router.query.slug;

  if (!product) return <div>Product not found</div>;

   const productInfo: ProductUIData = productData[product.slug as ProductSlug];

   if (!productInfo) return <div>Product UI not found</div>;

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <SEO
        title={`${product.name} | Vakro Pharma`}
        description={productInfo?.description || product.name}
        keywords={productInfo.keywords}
        url={`https://www.vakropharma.com/products/${slug}`}
      />

      {/* ✅ Product Schema (SEO Rich Results) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [`https://www.vakropharma.com/assets/${slug}.jpeg`],
            description: productInfo.description || product.name,
            url: `https://www.vakropharma.com/products/${slug}`,
            brand: {
              "@type": "Brand",
              name: "Vakro Pharma",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.mrp,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <Navbar source="product" />

      <ProductPage
        product={product}
        productInfo={productInfo}
      />

      <Footer source="product" />
    </>
  );
};

export default ProductSlugPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    await connectDB();
    const normalizedSlug = slug.toLowerCase().trim();
    const product = await Product.findOne({ slug: normalizedSlug }).lean();

    // 🔥 1. HANDLE OLD SLUG REDIRECTS
    if (!product) {
      const redirectMap: Record<string, string> = {
        facewash: "vakro-glo-depigmenting-facewash",
        facemoisturizer: "vakro-aqua-lite-moisturiser-face-gel",
        faceserum: "vakro-lite-face-serum",
        sunscreen: "vakro-lite-depigmenting-fluid-sunscreen",
      };

      const newSlug = redirectMap[normalizedSlug];

      if (newSlug) {
        return {
          redirect: {
            destination: `/products/${newSlug}`,
            permanent: true, // ✅ SEO safe (301)
          },
        };
      }
    }

    // 🔥 2. OPTIONAL: Check DB for oldSlug (scalable approach)
    // if (!product) {
    //   product = await Product.findOne({
    //     oldSlugs: normalizedSlug, // 👈 array field in DB
    //   }).lean();

    //   if (product) {
    //     return {
    //       redirect: {
    //         destination: `/products/${product.slug}`,
    //         permanent: true,
    //       },
    //     };
    //   }
    // }

    // ❌ 3. FINAL FALLBACK → 404
    if (!product) {
      return { notFound: true };
    }

    // ✅ 4. SUCCESS
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        slug: normalizedSlug,
      },
    };
  } catch (error) {
    console.error("SSR Product Error:", error);

    return { notFound: true };
  }
};