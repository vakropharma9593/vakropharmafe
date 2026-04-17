"use client";

import Image from "next/image";
import styles from "../styles/eachProduct.module.css";
import { useEffect, useState } from "react";
import AddReviewModal from "./AddReviewModal";
import { ProductType, Review } from "@/lib/utils";
import { productData, ProductUIData } from "@/lib/productData";
import { Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "@/store";
import Link from "next/link";
import ProductSkeleton from "./ProductSkeleton";
import Loader from "./Loader";

type ProductPageProps = {
  product: {
    _id: string;
    name: string;
    mrp: number;
    description?: string;
    slug: string;
  };
  productInfo: ProductUIData,
};

type ProductSlug = keyof typeof productData;

const ProductPage = ({
  product,
  productInfo
}: ProductPageProps) => {

  const [reviewsData, setReviewsData] = useState<{ reviews: Review[], totalReviews: number, averageRating: number, ratingBreakdown: Record<number, number> }>({ 
    reviews: [],
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: {}
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [reviewLoader, setReviewLoader] = useState<boolean>(false);
  const setProducts = useStore((state) => state.setProducts);
  const allProducts = useStore((state) => state.adminData.products);

  useEffect(() => {
    if (product) {
      getAllReviews(product?._id);
    }
  },[product])

  useEffect(() => {
    if(!allProducts || allProducts?.length === 0){
      getProducts()
    }
  },[allProducts])

  const getProducts = async () => {
    setLoader(true);
    try {
        const res = await fetch("/api/product", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        } else {
          toast.error(data.message);
        }
    } catch (error) {
      toast.error("Failed to get product");
    } finally {
      setLoader(false);
    }
  }

  const getAllReviews = async (id: string) => {
    setOpenModal(false);
    setReviewLoader(true);
    try {
      const res = await fetch(`/api/review?productId=${id}`);
      const data = await res.json();
      if(data.success) {
        setReviewsData(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews.");
    } finally {
      setReviewLoader(false);
    }
  }

 const bestReview =
  reviewsData.reviews.length > 0
    ? reviewsData.reviews.reduce((a, b) =>
        a.rating > b.rating ? a : b
      )
    : null;

  const handleBuyNow = () => {
    const phoneNumber = 919286382701;
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <main className={styles.productPage}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>

            <div className={styles.heroImage}>
              <div className={styles.zoomWrapper}>
                <Image
                  src={productInfo.heroImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  placeholder="blur"
                  style={{ objectFit: "contain" }} // 🔥 IMPORTANT
                />
              </div>
            </div>

            <div className={styles.heroContent}>
              <h1>{product.name}</h1>
              <div className={styles.topRating}>
                <div className={styles.starWrapper}>
                  <div
                    className={styles.starFill}
                    style={{
                      width: `${(reviewsData.averageRating / 5) * 100}%`
                    }}
                  >
                    ★★★★★
                  </div>
                  <div className={styles.starBase}>★★★★★</div>
                </div>
                <span className={styles.topRatingText}>
                  {reviewsData.averageRating} ({reviewsData.totalReviews} reviews)
                </span>
              </div>
              <p className={styles.tagline}>{productInfo.tagLine}</p>

              <div className={styles.price}>₹{product.mrp}</div>

              <ul className={styles.features}>
                {productInfo.features.map((f, i) => (
                  <li key={i}>{f.icon} {f.text}</li>
                ))}
              </ul>

              {/* PREMIUM INGREDIENT STRIP */}
              <div className={styles.heroIngredients}>
                <h3 className={styles.heroIngredientTitle}>Key Ingredients</h3>
                <p className={styles.heroIngredientSubtitle}>
                  Every ingredient is carefully selected to deliver visible results while being gentle on your skin.
                </p>

                <div className={styles.heroIngredientList}>
                  {productInfo.ingredients.map((ing, i) => (
                    <div key={i} className={styles.heroIngredientPill}>
                      <Sparkles size={12} />
                      {ing.name}
                    </div>
                  ))}
                </div>
              </div>

              <button className={styles.buyButton} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2>Why Choose Me</h2>

          <div className={styles.benefitGrid}>
            {productInfo.benefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                {b.icon}
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USAGE */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2>How to Use</h2>

          <p className={styles.usageSubtitle}>
            Follow this simple routine to get the best results
          </p>

          <div className={styles.steps}>
            {productInfo.usageSteps.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNumber}>0{i + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER PRODUCTS */}
      <section className={styles.otherProducts}>
        <div className={styles.container}>
          <h2>Build Your Routine</h2>

          <p className={styles.otherSubtitle}>
            Complete your routine with these carefully selected products
          </p>

          <div className={styles.routineSteps}>
            <span className={styles.routineStep}>Step 1: Cleanser</span>
            <span className={styles.routineStep}>Step 2: Serum</span>
            <span className={styles.routineStep}>Step 3: Moisturizer</span>
          </div>

          <div className={styles.otherGrid}>
            {Object.keys(productData)?.map((slug: string, i: number) => {
              if (slug === product.slug) return null;
              const p: ProductUIData = productData[slug as ProductSlug];
              const otherProduct = allProducts?.find((item: ProductType ) => item?.slug === slug);
              return (
                <div key={i} className={styles.productCard}>

                <div className={styles.productImage}>
                  <div className={styles.imageInner}>
                    <Image
                      src={p?.heroImage}
                      alt={p?.homepageData?.alt}
                      fill
                      sizes="(max-width: 600px) 50vw, 25vw"
                      placeholder="blur"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                <h3>{otherProduct?.name}</h3>

                <p className={styles.productTagline}>{p?.tagLine}</p>

                <div className={styles.productPrice}>₹{otherProduct?.mrp}</div>

                <Link href={`/products/${otherProduct?.slug}`} prefetch>
                  <button className={styles.viewButton}>
                    View Product
                  </button>
                </Link>

              </div>
            )})}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className={styles.reviews}>
        <div className={styles.container}>

          <div className={styles.reviewHeader}>
            <h2>Customer Reviews</h2>

            {/* SUMMARY */}
            <div className={styles.reviewSummary}>
              
              <div className={styles.leftSummary}>
                <div className={styles.bigRating}>{reviewsData.averageRating}</div>
                <div className={styles.starWrapper}>
                  <div
                    className={styles.starFill}
                    style={{
                      width: `${(reviewsData.averageRating / 5) * 100}%`
                    }}
                  >
                    ★★★★★
                  </div>
                  <div className={styles.starBase}>★★★★★</div>
                </div>
                <div className={styles.totalReviews}>
                  {reviewsData.totalReviews} reviews
                </div>
              </div>

              {/* ⭐ BREAKDOWN */}
              <div className={styles.breakdown}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewsData.ratingBreakdown[star] || 0;
                  const percentage = reviewsData.totalReviews
                    ? (count / reviewsData.totalReviews) * 100
                    : 0;

                  return (
                    <div key={star} className={styles.breakdownRow}>
                      <span>{star}★</span>

                      <div className={styles.bar}>
                        <div
                          className={styles.fill}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            <button
              className={styles.reviewButton}
              onClick={() => setOpenModal(true)}
            >
              Write a Review
            </button>
          </div>

          {/* 🌟 BEST REVIEW */}
          {bestReview && (
            <div className={styles.bestReview}>
              <div className={styles.badge}>Top Review</div>
              <div className={styles.reviewStars}>
                {"★".repeat(bestReview.rating)}
              </div>
              <p className={styles.bestText}>{bestReview.review}</p>
              <span className={styles.bestUser}>
                {bestReview.reviewerName} • {bestReview.skinType}
              </span>
            </div>
          )}

          {/* ALL REVIEWS */}
          <div className={styles.reviewScroll}>
            {reviewsData.reviews.map((r, i) => (
              <div key={i} className={styles.reviewCard}>

                <div className={styles.reviewTop}>
                  <div>
                    <strong>{r.reviewerName}</strong>
                    <div className={styles.reviewMeta}>
                      {r.skinType} • {r.skinConcern}
                    </div>
                  </div>

                  {r.isVerifiedUser && (
                    <span className={styles.verified}>✔ Verified</span>
                  )}
                </div>

                <div className={styles.reviewStars}>
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
                <p className={styles.reviewText}>{r.review}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {openModal && (
        <AddReviewModal
          onClose={() => setOpenModal(false)}
          productId={product?._id}
          afterSuccessCall={() => getAllReviews(product?._id)}
          productName={product?.name}
        />
      )}

      <div className={styles.stickyBar}>
        <div className={styles.stickyContent}>
          <div>
            <div className={styles.stickyName}>{product.name}</div>
            <div className={styles.stickyPrice}>₹{product.mrp}</div>
          </div>

          <button className={styles.stickyBtn} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
      {loader && <ProductSkeleton />}
      {reviewLoader && <Loader />}
    </main>
  );
};

export default ProductPage;