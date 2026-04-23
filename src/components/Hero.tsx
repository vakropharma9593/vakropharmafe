"use client";

import heroImage from "../../public/assets/allproducts.svg";
import { ArrowRight, Sparkles, ShieldCheck, Leaf } from "lucide-react";
import Image from "next/image";
import styles from "../styles/hero.module.css";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const products = useStore((state) => state.homepageData);
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Parallax offset for image
  const parallaxOffset = scrollY * 0.18;

  return (
    <section id="home" className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`} ref={heroRef}>

      {/* ── Ambient background layers ── */}
      <div className={styles.ambientLayer}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.noiseOverlay} />
      </div>

      {/* ── Floating ingredient tags ── */}
      {/* <div className={styles.floatingTags} style={{ transform: `translateY(${-scrollY * 0.08}px)` }}>
        <span className={`${styles.tag} ${styles.tag1}`}>Niacinamide</span>
        <span className={`${styles.tag} ${styles.tag2}`}>SPF 50+</span>
        <span className={`${styles.tag} ${styles.tag3}`}>Azelaic Acid</span>
        <span className={`${styles.tag} ${styles.tag4}`}>Ceramides</span>
      </div> */}

      <div className={styles.container}>
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>Dermatologist Tested & Approved</span>
        </div>
        <div className={styles.heroGrid}>

          {/* ── LEFT CONTENT ── */}
          <div className={styles.heroText}>

            {/* <div className={styles.badge}>
              <Sparkles size={14} className={styles.badgeIcon} />
              <span>Dermatologist Tested & Approved</span>
            </div> */}

            <h1 className={styles.title}>
              <span className={styles.titleLine1}>Advanced</span>
              <span className={styles.titleLine2}>Skincare</span>
              <span className={styles.titleLine3}>Solutions</span>
            </h1>

            <p className={styles.description}>
              Clinically proven formulas with{" "}
              <mark className={styles.highlight}>Salicylic Acid</mark>,{" "}
              <mark className={styles.highlight}>Azelaic Acid</mark> &{" "}
              <mark className={styles.highlight}>Kojic Acid</mark> &{" "}
              <mark className={styles.highlight}>Niacinamide</mark> &{" "}
              <mark className={styles.highlight}>Ceramides</mark> &{" "}
              <mark className={styles.highlight}>SPF 50+</mark> — targeting
              acne, dark spots, and sun damage.
            </p>

            {/* Trust pillars */}
            <div className={styles.pillars}>
              <div className={styles.pillar}>
                <ShieldCheck size={16} />
                <span>Clinically Tested</span>
              </div>
              <div className={styles.pillar}>
                <Leaf size={16} />
                <span>Non-Comedogenic</span>
              </div>
            </div>

            <div className={styles.buttons}>
              <button onClick={scrollToProducts} className={styles.primaryBtn}>
                <span>Explore Products</span>
                <span className={styles.btnArrow}>
                  <ArrowRight size={16} />
                </span>
              </button>
            </div>

            {/* Stats — neumorphic cards */}
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{products?.length ?? "4"}</div>
                <div className={styles.statLabel}>Premium Products</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>1K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              {/* <div className={styles.statCard}>
                <div className={styles.statNumber}>SPF<br />50+</div>
                <div className={styles.statLabel}>Sun Protection</div>
              </div> */}
            </div>

          </div>

          {/* ── RIGHT IMAGE ── */}
          <div
            className={styles.imageContainer}
            ref={imageRef}
            style={{ transform: `translateY(${-parallaxOffset}px)` }}
          >
            {/* Neumorphic frame */}
            <div className={styles.neuFrame}>
              <div className={styles.imageWrapper}>
                <Image
                  src={heroImage}
                  alt="Vakro skincare products"
                  width={647}
                  height={616}
                  className={styles.heroImage}
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  // placeholder="blur"
                />
                {/* Subtle vignette overlay */}
                <div className={styles.imageVignette} />
              </div>
            </div>

            {/* Orbiting accent ring */}
            {/* <div className={styles.orbitRing} />
            <div className={styles.orbitRing2} /> */}

            {/* Floating product badge */}
            <div className={styles.floatBadge}>
              <div className={styles.floatBadgeInner}>
                <div className={styles.floatBadgeDot} />
                <div>
                  <div className={styles.floatBadgeTitle}>4-in-1 Routine</div>
                  <div className={styles.floatBadgeSub}>Complete Skincare</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className={styles.bottomFade} />
    </section>
  );
};

export default Hero;