import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

import { GetStaticPaths, GetStaticProps } from "next";
import ProductPage from "@/components/ProductPage";
import { productData, ProductUIData } from "@/lib/productData";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductSkeleton from "@/components/ProductSkeleton";

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
  if (!product) return <ProductSkeleton />;

  const productInfo: ProductUIData =
    productData[product.slug as ProductSlug];

  if (!productInfo) return <ProductSkeleton />;

  return (
    <>
      <SEO
        title={`${product.name} | Vakro Pharma`}
        description={productInfo?.description || product.name}
        keywords={productInfo.keywords}
        url={`https://www.vakropharma.com/products/${product.slug}`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [`https://www.vakropharma.com/assets/${product.slug}.jpeg`],
            description: productInfo.description || product.name,
            url: `https://www.vakropharma.com/products/${product.slug}`,
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

      <ProductPage product={product} productInfo={productInfo} />

      <Footer source="product" />
    </>
  );
};

export default ProductSlugPage;


// ✅ Pre-build all product pages
export const getStaticPaths: GetStaticPaths = async () => {
  await connectDB();

  const products = await Product.find({}, "slug").lean();

  const paths = products.map((p) => ({
    params: { slug: p.slug },
  }));

  return {
    paths,
    fallback: "blocking", // 🔥 new products auto-supported
  };
};


// ✅ Fetch product data
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    await connectDB();

    const normalizedSlug = slug.toLowerCase().trim();

    let product = await Product.findOne({
      slug: normalizedSlug,
    }).lean();

    // 🔥 Handle old slugs
    if (!product) {
      product = await Product.findOne({
        oldSlugs: normalizedSlug,
      }).lean();

      if (product) {
        return {
          redirect: {
            destination: `/products/${product.slug}`,
            permanent: true,
          },
        };
      }
    }

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
      revalidate: 60, // 🔥 ISR (refresh every 60 sec)
    };
  } catch (error) {
    return { notFound: true };
  }
};