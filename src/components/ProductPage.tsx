"use client";

import Image from "next/image";
import styles from "../styles/eachProduct.module.css";
import { useEffect, useState, useRef } from "react";
import AddReviewModal from "./AddReviewModal";
import { HomepageProduct, Review } from "@/lib/utils";
import { productData, ProductUIData } from "@/lib/productData";
import { Sparkles, ShieldCheck, Star, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "@/store";
import Link from "next/link";
import ProductSkeleton from "./ProductSkeleton";

type ProductPageProps = {
  product: {
    _id: string;
    name: string;
    mrp: number;
    description?: string;
    slug: string;
  };
  productInfo: ProductUIData;
};

type ProductSlug = keyof typeof productData;

const ProductPage = ({ product, productInfo }: ProductPageProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [reviewLoader, setReviewLoader] = useState<boolean>(false);
  const setProducts = useStore((state) => state.setHomepageData);
  const allProducts = useStore((state) => state.homepageData);
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const benefitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: {} as Record<number, number>,
  });

  const [bestReview, setBestReview] = useState<Review | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.inView);
          }
        });
      },
      { threshold: 0.15 }
    );

    [...benefitRefs.current, ...stepRefs.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (product) {
      setPage(1);
      getAllReviews(1);
    }
  }, [product]);

  useEffect(() => {
    if (!allProducts || allProducts?.length === 0) {
      getHomepageData();
    }
  }, [allProducts]);

  const getHomepageData = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/website/homepage", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to get product");
    } finally {
      setLoader(false);
    }
  };

  const getAllReviews = async (pageNum: number) => {
    setOpenModal(false);
    if (!product?._id) return;
    try {
      setReviewLoader(true);
      const res = await fetch(
        `/api/review?productId=${product._id}&page=${pageNum}&limit=10`
      );
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          pageNum === 1 ? data.data : [...prev, ...data.data]
        );
        if (pageNum === 1) {
          setStats(data.productStats);
          setBestReview(data.bestReview);
        }
        setHasMore(data.pagination.hasMore);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setReviewLoader(false);
    }
  };

  const handleReviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      if (hasMore && !reviewLoader) {
        getAllReviews(page + 1);
        setPage((p) => p + 1);
      }
    }
  };

  const handleBuyNow = () => {
    window.open(`https://wa.me/919286382701`, "_blank");
  };

  return (
    <main className={`${styles.productPage} ${isVisible ? styles.visible : ""}`}>
      {loader && <div className={styles.loaderBar} />}

      {/* ── HERO ── */}
      <section className={styles.hero}>

        {/* ambient blobs */}
        <div className={styles.heroBg}>
          <div className={styles.hBlob1} />
          <div className={styles.hBlob2} />
          <div className={styles.noiseLayer} />
        </div>

        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <span>Skincare</span>
            <ChevronRight size={12} />
            <span className={styles.breadcrumbActive}>{product.name}</span>
          </div>
          <div className={styles.heroGrid}>

            {/* IMAGE */}
            <div className={styles.heroImageCol}>
              <div className={styles.neuFrame}>
                <div className={styles.zoomWrapper}>
                  <Image
                    src={productInfo.heroImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              {/* orbiting accent */}
              {/* <div className={styles.orbit1} />
              <div className={styles.orbit2} /> */}

              {/* floating trust badge */}
              <div className={styles.trustBadge}>
                <ShieldCheck size={14} className={styles.trustIcon} />
                <div>
                  <div className={styles.trustTitle}>Dermatologist</div>
                  <div className={styles.trustSub}>Tested & Approved</div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className={styles.heroContent}>

              {/* <div className={styles.breadcrumb}>
                <span>Skincare</span>
                <ChevronRight size={12} />
                <span className={styles.breadcrumbActive}>{product.name}</span>
              </div> */}

              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Rating */}
              <div className={styles.topRating}>
                <div className={styles.starWrapper}>
                  <div className={styles.starFill} style={{ width: `${(stats.averageRating / 5) * 100}%` }}>
                    ★★★★★
                  </div>
                  <div className={styles.starBase}>★★★★★</div>
                </div>
                <span className={styles.topRatingText}>
                  {stats.averageRating} · {stats.totalReviews} reviews
                </span>
              </div>

              <p className={styles.tagline}>{productInfo.tagLine}</p>

              {/* Price — neumorphic chip */}
              <div className={styles.priceChip}>
                {/* <span className={styles.priceLabel}>Price</span> */}
                <span className={styles.priceValue}>₹{product.mrp}</span>
              </div>

              {/* Features */}
              <ul className={styles.features}>
                {productInfo.features.map((f, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Key Ingredients */}
              <div className={styles.heroIngredients}>
                <h3 className={styles.heroIngredientTitle}>
                  <Sparkles size={13} />
                  Key Ingredients
                </h3>
                <div className={styles.heroIngredientList}>
                  {productInfo.ingredients.map((ing, i) => (
                    <div key={i} className={styles.heroIngredientPill}>
                      {ing.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button className={styles.buyButton} onClick={handleBuyNow}>
                <span>Buy Now</span>
                <span className={styles.buyArrow}>
                  <ChevronRight size={16} />
                </span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          {/* <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>What sets us apart</p>
            <h2 className={styles.sectionTitle}>Why Choose Vakro</h2>
          </div> */}

          <div className={styles.benefitGrid}>
            {productInfo.benefits.map((b, i) => (
              <div
                key={i}
                ref={(el) => { benefitRefs.current[i] = el; }}
                className={styles.benefitCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.benefitIconWrap}>{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className={styles.usageSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Your daily ritual</p>
            <h2 className={styles.sectionTitle}>How to Use</h2>
            <p className={styles.sectionSub}>
              Follow this simple routine to get the best results
            </p>
          </div>

          <div className={styles.steps}>
            {productInfo.usageSteps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepRefs.current[i] = el; }}
                className={styles.stepCard}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className={styles.stepNumber}>0{i + 1}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepLine} />
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER PRODUCTS ── */}
      <section className={styles.otherProducts}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Complete your ritual</p>
            <h2 className={styles.sectionTitle}>Build Your Routine</h2>
            <p className={styles.sectionSub}>
              Carefully selected products to pair with yours
            </p>
          </div>

          <div className={styles.routineSteps}>
            {["Step 1: Facewash", "Step 2: Moisturizer", "Step 3: Sunscreen", "Step 4: Serum"].map((s, i) => (
              <span key={i} className={styles.routineStep}>{s}</span>
            ))}
          </div>

          <div className={styles.otherGrid}>
            {Object.keys(productData).map((slug, i) => {
              if (slug === product.slug) return null;
              const p: ProductUIData = productData[slug as ProductSlug];
              const otherProduct = allProducts?.find(
                (item: HomepageProduct) => item?.slug === slug
              );
              return (
                <div key={i} className={styles.productCard}>
                  <div className={styles.productImageWrap}>
                    <div className={styles.imageInner}>
                      <Image
                        src={p?.heroImage}
                        alt={p?.homepageData?.alt}
                        fill
                        sizes="(max-width: 600px) 50vw, 25vw"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <h3 className={styles.cardName}>{otherProduct?.name}</h3>
                  <p className={styles.productTagline}>{p?.tagLine}</p>
                  <div className={styles.productPrice}>₹{otherProduct?.mrp}</div>
                  <Link href={`/products/${otherProduct?.slug}`} prefetch>
                    <button className={styles.viewButton}>
                      View Product <ChevronRight size={13} />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className={styles.reviewsSection}>
        {reviewLoader ? (
          <ProductSkeleton />
        ) : (
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Real people, real results</p>
              <h2 className={styles.sectionTitle}>Customer Reviews</h2>
            </div>

            <div className={styles.reviewLayout}>
              {/* Summary panel */}
              <div className={styles.reviewSummaryPanel}>
                <div className={styles.bigRating}>{stats.averageRating}</div>
                <div className={styles.starWrapper} style={{ fontSize: 22 }}>
                  <div className={styles.starFill} style={{ width: `${(stats.averageRating / 5) * 100}%` }}>★★★★★</div>
                  <div className={styles.starBase}>★★★★★</div>
                </div>
                <div className={styles.totalReviews}>{stats.totalReviews} reviews</div>

                <div className={styles.breakdown}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.ratingBreakdown[star] || 0;
                    const pct = stats.totalReviews ? (count / stats.totalReviews) * 100 : 0;
                    return (
                      <div key={star} className={styles.breakdownRow}>
                        <span className={styles.breakdownStar}>{star}★</span>
                        <div className={styles.bar}>
                          <div className={styles.fill} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={styles.breakdownCount}>{count}</span>
                      </div>
                    );
                  })}
                </div>

                <button className={styles.reviewButton} onClick={() => setOpenModal(true)}>
                  <MessageSquare size={14} />
                  Write a Review
                </button>
              </div>

              {/* Review list */}
              <div className={styles.reviewListCol}>
                {/* Best review */}
                {bestReview && (
                  <div className={styles.bestReview}>
                    <div className={styles.bestBadge}>
                      <Star size={11} fill="currentColor" />
                      Top Review
                    </div>
                    <div className={styles.reviewStars}>
                      {"★".repeat(bestReview.rating)}
                    </div>
                    <p className={styles.bestText}>{bestReview.review}</p>
                    <span className={styles.bestUser}>
                      {bestReview.reviewerName} · {bestReview.skinType}
                    </span>
                  </div>
                )}

                {/* Scrollable list */}
                <div className={styles.reviewScroll} onScroll={handleReviewScroll}>
                  {reviews.map((r, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <div>
                          <strong className={styles.reviewerName}>{r.reviewerName}</strong>
                          <div className={styles.reviewMeta}>
                            {r.skinType} · {r.skinConcern}
                          </div>
                        </div>
                        {r.isVerifiedUser && (
                          <span className={styles.verified}>✔ Verified</span>
                        )}
                      </div>
                      <div className={styles.reviewStars}>
                        {"★".repeat(r.rating)}
                        <span className={styles.emptyStars}>{"☆".repeat(5 - r.rating)}</span>
                      </div>
                      <p className={styles.reviewText}>{r.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {openModal && (
        <AddReviewModal
          onClose={() => setOpenModal(false)}
          productId={product?._id}
          afterSuccessCall={() => getAllReviews(1)}
          productName={product?.name}
        />
      )}

      {/* Sticky bar */}
      {!openModal && <div className={styles.stickyBar}>
        <div className={styles.stickyContent}>
          <div>
            <div className={styles.stickyName}>{product.name}</div>
            <div className={styles.stickyPrice}>₹{product.mrp}</div>
          </div>
          <button className={styles.stickyBtn} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>}
    </main>
  );
};

export default ProductPage;