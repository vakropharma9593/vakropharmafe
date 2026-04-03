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
            image: `https://www.vakropharma.com/assets/${slug}.jpeg`,
            description: productInfo.description || product.name,
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
    // const baseUrl =
    //   process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // const res = await fetch(
    //   `${baseUrl}/api/product/slug/${slug}`
    // );

    // const data = await res.json();

    // debugger;

    // if (!data.success) {
    //   return { notFound: true };
    // }

    await connectDB();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
        return { notFound: true };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        slug,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};