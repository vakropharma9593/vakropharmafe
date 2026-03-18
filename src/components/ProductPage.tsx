import Image, { StaticImageData } from "next/image";
import styles from "../styles/eachProduct.module.css";
import { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  text: string;
};

type Benefit = {
  icon: ReactNode;
  title: string;
  description: string;
};

type Ingredient = {
  name: string;
  description: string;
};

type ProductPageProps = {
  title: string;
  price: string;
  heroImage: StaticImageData;
  usageImage: StaticImageData;
  tagline: string;
  features: Feature[];
  benefitsTitle: string;
  benefits: Benefit[];
  ingredients: Ingredient[];
  usageSteps: string[];
  product: string;
};

const ProductPage = ({
  title,
  price,
  heroImage,
  usageImage,
  tagline,
  features,
  benefitsTitle,
  benefits,
  ingredients,
  usageSteps,
  product
}: ProductPageProps) => {
  const handleBuyNow = () => {
    const phoneNumber = 919286382701;
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  }

  return (
    <main className={styles.productPage}>

      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>

            <div className={styles.heroImage}>
              <Image src={heroImage} alt={title} priority />
            </div>

            <div className={styles.heroContent}>
              <h1>{title}</h1>

              <p className={styles.tagline}>
                {tagline}
              </p>

              <div className={styles.price}>
                ₹{price}
              </div>

              <ul className={styles.features}>
                {features.map((f, i) => (
                  <li key={i}>
                    {f.icon} {f.text}
                  </li>
                ))}
              </ul>

              <button className={styles.buyButton} onClick={() => handleBuyNow()} >
                Buy Now
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS */}

      <section className={styles.benefits}>
        <div className={styles.container}>

          <h2>{benefitsTitle}</h2>

          <div className={styles.benefitGrid}>
            {benefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                {b.icon}
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INGREDIENTS */}

      <section className={styles.ingredients}>
        <div className={styles.container}>

          <h2>Key Ingredients</h2>

          <div className={`${styles.ingredientGrid} ${product === "facewash" ? styles.threeGrid : ""}`}>
            {ingredients.map((ing, i) => (
              <div key={i} className={styles.ingredientCard}>
                <h3>{ing.name}</h3>
                <p>{ing.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW TO USE */}

      <section className={styles.usage}>
        <div className={styles.container}>

          <div className={styles.usageGrid}>

            <div className={styles.usageImage}>
              <Image src={usageImage} alt="How to use product" priority />
            </div>

            <div className={styles.usageSteps}>

              <h2>How to Use</h2>

              <ol>
                {usageSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default ProductPage;