import facewash from "../../public/assets/vakro-glo-depigmenting-facewash.jpeg";
import faceSerum from "../../public/assets/vakro-lite-face-serum.jpeg";
import moisturizer from "../../public/assets/vakro-aqua-lite-moisturiser-face-gel.jpeg";
import sunscreen from "../../public/assets/vakro-lite-depigmenting-fluid-sunscreen.jpeg";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/products.module.css";

const products = [
  {
    name: "Vakro-glo depigmenting facewash",
    description:
      "Experience the Art of Balanced Skin with Vakro Depigmenting Face Wash.",
    category: "Face Care",
    image: facewash,
    alt: "Vakro Glow Balance Depigmenting Face Wash with Salicylic Acid and Niacinamide",
    productLink: "/products/vakro-glo-depigmenting-facewash",
  },
  {
    name: "Vakro-lite face serum",
    description: "Multi-Active Acne Clarifying & Oil Balancing Serum.",
    category: "Face Care",
    image: faceSerum,
    alt: "Vakro Lite Dual Hit Serum with Azelaic Acid and Salicylic Acid for acne control",
    productLink: "/products/vakro-lite-face-serum",
  },
  {
    name: "Vakro-aqua lite moisturiser face gel",
    description:
      "Experience advanced hydration with powerful sun defense in one lightweight formula.",
    category: "Face Care",
    image: moisturizer,
    alt: "Vakro Aqualite SPF 50+ Face Moisturizer Gel with 5 Ceramides",
    productLink: "/products/vakro-aqua-lite-moisturiser-face-gel",
  },
  {
    name: "Vakro-lite depigmenting fluid sunscreen",
    description:
      "Broad-spectrum SPF 50+ sunscreen that protects from UV damage and helps reduce dark spots for an even-toned glow.",
    category: "Sun Care",
    image: sunscreen,
    alt: "Vakro Lite Anti-Pigment SPF 50+ Broad Spectrum Sunscreen",
    productLink: "/products/vakro-lite-depigmenting-fluid-sunscreen",
  },
];

const Products = () => {
  const router = useRouter();

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
          {products.map((product, index) => (
            <div
              key={index}
              className={styles.productCard}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => router.push(product.productLink)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 600px) 100vw,
                        (max-width: 1024px) 50vw,
                        25vw"
                  className={styles.productImage}
                  priority
                />

                <span className={styles.categoryBadge}>
                  {product.category}
                </span>
              </div>

              <div className={styles.productContent}>
                <h2 className={styles.productName}>
                  {product.name}
                </h2>

                <p className={styles.productDescription}>
                  {product.description}
                </p>

                <div className={styles.viewProduct}>
                  View Product →
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Products;