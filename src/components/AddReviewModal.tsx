"use client";

import { useState } from "react";
import styles from "../styles/addReviewModal.module.css";
import { ProductType, Review } from "@/lib/utils";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import Image from "next/image";
import vakroLogo from "../../public/assets/darkGreenLogo.svg";
import { useRouter } from "next/router";

type Props = {
  onClose: () => void;
  productId?: string;
  afterSuccessCall: () => void;
  source?: string;
  products?: ProductType[];
};

const AddReviewModal = ({ onClose, productId, afterSuccessCall, source, products }: Props) => {
  const router = useRouter();
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState<Review>({
    reviewerName: "",
    skinType: "",
    skinConcern: "",
    rating: 0,
    review: "",
    phone: "",
    email: "",
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [errors, setErrors] = useState({ phone: "", email: "" });
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (value: number) => {
    setForm({ ...form, rating: value });
  };

  const handleSubmit = async () => {
    if (!form.reviewerName || !form.review || form.rating === 0 || (!productId && !selectedProductId)) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
        setLoader(true);
        const dataToSend = {
            productId: source === "sharedLink" ? selectedProductId : productId,
            reviewerName: form.reviewerName,
            review: form.review,
            rating: form.rating,
            skinType: form.skinType,
            skinConcern: form.skinConcern,
            email: form.email,
            phone: form.phone,
        }
        const res = await fetch("/api/review", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataToSend),
            });

        const data = await res.json();
        if (data.success) {
            afterSuccessCall();
            toast.success("Order created successfully");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Failed to create order");
    } finally {
        setLoader(false);
    }
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        return true;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        setErrors((prev) => ({
            ...prev,
            phone: "Phone must be 10 digits",
        }));
        return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email) {
        setErrors((prev) => ({ ...prev, email: "" }));
        return true;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address",
        }));
        return false;
    }

    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
    };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {source === "sharedLink" ? null : <h2>Write a Review</h2>}
        {source === "sharedLink" && <div className={styles.logoSection} onClick={() => router.push("/")}>
          <Image src={vakroLogo} alt="Vakro" width={60} height={60} className={styles.logo}/>
          <h2>Write a Review</h2>
        </div>}
        <div className={styles.formSection}>
          {source === "sharedLink" && <div className={styles.formGroup}>
            <label className={styles.label}>Select Product</label>

            <div className={styles.radioGrid}>
              {products?.map((item: ProductType) => (
                <label key={item._id} className={styles.radioCard}>
                  <input
                    type="radio"
                    name="productId"
                    value={item._id}
                    checked={selectedProductId === item._id}
                    onChange={(e) =>
                      setSelectedProductId(e.target.value)
                    }
                  />

                  <span className={styles.customRadio}></span>

                  <span className={styles.productName}>
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </div>}
          <div className={styles.formGroup}>
            <label>Rating <span>*</span></label>
            <div className={styles.starContainer}>
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${
                    (hover || form.rating) >= star ? styles.active : ""
                  }`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
              <label>Your Name <span>*</span></label>
              <input
              name="reviewerName"
              placeholder="Your Name *"
              onChange={handleChange}
              />
          </div>
          <div className={styles.formGroup}>
              <label>Your Skin Type</label>
              <input
              name="skinType"
              placeholder="Skin Type (Oily/Dry/Combination)"
              onChange={handleChange}
              />
          </div>
          <div className={styles.formGroup}>
              <label>Skin Concerns</label>
              <input
              name="skinConcern"
              placeholder="Skin Concern (Acne, Pigmentation...)"
              onChange={handleChange}
              />
          </div>
          <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                  placeholder="Phone"
                  value={form.phone}
                  maxLength={10}
                  onChange={(e) =>
                      setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, ""),
                      })
                  }
                  onBlur={() => validatePhone(form?.phone || "")}
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              <div className={styles.emailHint}>
                  <span className={styles.lockIcon}>🔒</span>
                  No worries, we won’t spam you
              </div>
          </div>
          <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                  setForm({
                      ...form,
                      email: e.target.value,
                  })
                  }
                  onBlur={() => validateEmail(form?.email || "")}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
              <div className={styles.emailHint}>
                  <span className={styles.lockIcon}>🔒</span>
                  No worries, we won’t spam you
              </div>
          </div>
          <div className={styles.formGroup}>
              <label>Your Review <span>*</span></label>
              <textarea
              name="review"
              placeholder="Write your experience *"
              onChange={handleChange}
              />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.submit}>
            Submit Review
          </button>
        </div>

      </div>
      {loader && <Loader />}
    </div>
  );
};

export default AddReviewModal;