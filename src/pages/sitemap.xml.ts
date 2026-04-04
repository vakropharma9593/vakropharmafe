import { GetServerSideProps } from "next";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { ProductType } from "@/lib/utils";

const BASE_URL = "https://www.vakropharma.com";

function generateSiteMap(products: ProductType[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <!-- Home -->
    <url>
      <loc>${BASE_URL}/</loc>
      <priority>1.0</priority>
    </url>

    <!-- Static Pages -->
    <url>
      <loc>${BASE_URL}/faq</loc>
      <priority>0.5</priority>
    </url>

    <url>
      <loc>${BASE_URL}/review</loc>
      <priority>0.5</priority>
    </url>

    <!-- Product Pages -->
    ${products
      .map((product) => {
        return `
          <url>
            <loc>${BASE_URL}/products/${product.slug}</loc>
            <priority>0.9</priority>
            <lastmod>${product?.updatedAt ? new Date(product?.updatedAt).toISOString() : ""}</lastmod>
          </url>
        `;
      })
      .join("")}

    <!-- Review Pages -->
    ${products
      .map((product) => {
        return `
          <url>
            <loc>${BASE_URL}/review/${product.slug}</loc>
            <priority>0.7</priority>
            <lastmod>${product?.updatedAt ? new Date(product?.updatedAt).toISOString() : ""}</lastmod>
          </url>
        `;
      })
      .join("")}

  </urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await connectDB();

    const products = await Product.find({}, "slug updatedAt").lean();

    const sitemap = generateSiteMap(products);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error("Sitemap error:", error);

    // fallback empty sitemap (never crash)
    res.setHeader("Content-Type", "text/xml");
    res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>`);
    res.end();

    return {
      props: {},
    };
  }
};

export default function SiteMap() {
  return null;
}