import SEO from "@/components/SEO";
import styles from "./faq.module.css";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqData = [
  {
    question: "Is Vakro Facewash suitable for acne-prone skin?",
    answer:
      "Yes. Vakro Depigmenting Facewash contains salicylic acid and niacinamide that help unclog pores, control oil and reduce acne."
  },
  {
    question: "Can I use Vakro products daily?",
    answer:
      "Yes, Vakro skincare products are designed for daily use. Facewash can be used twice a day while sunscreen should be applied every morning."
  },
  {
    question: "Are Vakro products dermatologist developed?",
    answer:
      "Yes. Vakro Pharma products are developed by dermatology experts using clinically proven ingredients."
  },
  {
    question: "Which Vakro product helps with pigmentation?",
    answer:
      "Vakro Face Serum and Depigmenting Facewash help reduce pigmentation and improve overall skin tone."
  },
  {
    question: "Is Vakro sunscreen suitable for oily skin?",
    answer:
      "Yes. Vakro sunscreen is lightweight, non-greasy and suitable for oily and acne-prone skin."
  }
];

const FAQ = () => {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActive(active === index ? null : index);
  };

  return (
    <>
      <SEO
        title="FAQ | Vakro Pharma Skincare Questions"
        description="Frequently asked questions about Vakro Pharma skincare products including facewash, serum, moisturizer and sunscreen."
        url="https://www.vakropharma.com/faq"
      />

      <Navbar source="product" />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
              }
            }))
          })
        }}
      />

      <section className={styles.section}>

        <div className={styles.header}>
          <h1>Frequently Asked Questions</h1>
          <p>
            Everything you need to know about Vakro skincare products
            and dermatology-backed formulations.
          </p>
        </div>

        <div className={styles.faqWrapper}>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${
                active === index ? styles.active : ""
              }`}
            >
              <button
                className={styles.question}
                onClick={() => toggle(index)}
              >
                <span>{faq.question}</span>

                <span className={styles.icon}>
                  {active === index ? "−" : "+"}
                </span>
              </button>

              <div
                className={`${styles.answerWrapper} ${
                  active === index ? styles.show : ""
                }`}
              >
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer source="product" />
    </>
  );
};

export default FAQ;