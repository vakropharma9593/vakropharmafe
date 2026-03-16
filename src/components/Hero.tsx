import heroImage from "../../public/assets/vakroallproducts.jpeg";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import styles from "../styles/hero.module.css";

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className={styles.heroSection}>
      
      <div className={styles.backgroundDecor}>
        <div className={styles.circleOne}></div>
        <div className={styles.circleTwo}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.heroGrid}>

          {/* LEFT CONTENT */}

          <div className={styles.heroText}>

            <div className={styles.badge}>
              <Sparkles size={16} />
              Dermatologist Tested & Approved
            </div>

            <h1 className={styles.title}>
              Advanced Skincare Solutions for Acne, Pigmentation & Sun Protection
            </h1>

            <p className={styles.description}>
              Vakro brings dermatologist-inspired skincare powered by clinically
              proven ingredients like Salicylic Acid, Azelaic Acid, Niacinamide,
              Ceramides, and SPF 50+ protection to target acne, dark spots,
              excess oil, and sun damage.
            </p>

            <div className={styles.buttons}>
              <button onClick={scrollToProducts} className={styles.primaryBtn}>
                Explore Products
                <ArrowRight size={18} />
              </button>
            </div>

            <div className={styles.stats}>
              
              <div className={styles.stat}>
                <div className={styles.statNumber}>4</div>
                <div className={styles.statLabel}>Premium Products</div>
              </div>

              {/* <div className={styles.divider}></div> */}

              {/* <div className={styles.stat}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Natural Ingredients</div>
              </div> */}

              <div className={styles.divider}></div>

              <div className={styles.stat}>
                <div className={styles.statNumber}>1K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>

              <Image
                src={heroImage}
                height={616}
                width={647}
                alt="Vakro skincare products"
                className={styles.heroImage}
              />

            </div>

            <div className={styles.imageGlow}></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;