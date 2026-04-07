import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/products.module.css";
import { HomePageData, productData } from "@/lib/productData";
import { useStore } from "@/store";

const Products = () => {
  const router = useRouter();
  const products = useStore((state) => state.adminData.products);
  type ProductSlug = keyof typeof productData;


  return (
    <section id="products" className={styles.productsSection}>
      <div className={styles.container}>

        <div className={styles.header}>
          <span className={styles.badge}>Our Skincare Range</span>

          <p className={styles.description}>
            Discover dermatologist-tested skincare powered by clinically proven
            ingredients for acne control, hydration, pigmentation care and
            daily sun protection.
          </p>
        </div>

        <div className={styles.productsGrid}>
          {products?.length > 0 && products?.map((product, index) => {
            if (!product.isActive) return null;
            const productHomeData: HomePageData = productData[product.slug as ProductSlug].homepageData;
            return (
              <div
                key={index}
                className={styles.productCard}
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => router.push(productHomeData.productLink)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={productHomeData.image}
                    alt={productHomeData.alt}
                    fill
                    sizes="(max-width: 600px) 100vw,
                          (max-width: 1024px) 50vw,
                          25vw"
                    className={styles.productImage}
                    priority
                  />

                  <span className={styles.categoryBadge}>
                    {productHomeData.category}
                  </span>
                </div>

                <div className={styles.productContent}>
                  <h2 className={styles.productName}>
                    {product.name}
                  </h2>

                  <p className={styles.productDescription}>
                    {productHomeData.description}
                  </p>

                  <div className={styles.viewProduct}>
                    View Product →
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
};

export default Products;