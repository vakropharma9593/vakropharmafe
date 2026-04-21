import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/products.module.css";
import { HomePageData, productData } from "@/lib/productData";
import { useStore } from "@/store";
import MiniLoader from "./MiniLoader";
import { useRouter } from "next/router";

const Products = () => {
  const homepageData = useStore((state) => state.homepageData);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const router = useRouter();

  type ProductSlug = keyof typeof productData;

  const preloadImage = (src: string | StaticImageData) => {
    const img = new window.Image();

    img.src = typeof src === "string" ? src : src.src;
  };

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
          {homepageData?.length > 0 &&
            homepageData.map((product, index) => {
              if (!product.isActive) return null;

              const productHomeData: HomePageData =
                productData[product.slug as ProductSlug].homepageData;

              return (
                <Link
                  key={index}
                  href={productHomeData.productLink}
                  onClick={() => setLoadingIndex(index)}
                  onMouseEnter={() => {
                    preloadImage(productHomeData.image);
                    router.prefetch(productHomeData.productLink);
                  }}
                  className={styles.productCard}
                  style={{ animationDelay: `${index * 80}ms` }}
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

                      // ✅ Only first 2 images priority (above fold)
                      priority={index < 2}

                      // ✅ Smooth loading
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,..."

                      // ✅ Performance
                      loading={index < 2 ? "eager" : "lazy"}
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
                  {/* 🔥 Instant feedback */}
                  {loadingIndex === index && (
                    <MiniLoader />
                  )}
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Products;