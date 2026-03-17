import { Shield, Leaf, Award, Heart } from "lucide-react";
import styles from "../styles/benefits.module.css";

const benefits = [
  {
    icon: Shield,
    title: "Dermatologist Tested",
    description:
      "All our products are clinically tested and approved by certified dermatologists for safety and efficacy.",
  },
  // {
  //   icon: Leaf,
  //   title: "100% Natural",
  //   description:
  //     "We use only natural botanical extracts and ingredients, free from harmful chemicals and parabens.",
  // },
  // {
  //   icon: Award,
  //   title: "Award Winning",
  //   description:
  //     "Recognized by industry experts for excellence in skincare innovation and product quality.",
  // },
  {
    icon: Award,
    title: "Dermatologist Recommended",
    description:
      "Recommended by India's best dermatologist doctors.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description:
      "We never test on animals and are committed to ethical and sustainable beauty practices.",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className={styles.benefitsSection}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h2 className={styles.title}>
            Why Choose <span className={styles.titleHighlight}>Vakro</span>
          </h2>

          <p className={styles.description}>
            We are committed to delivering dermatologist-inspired skincare
            powered by clinically proven ingredients and safe formulations.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className={styles.benefitCard}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={26} />
                </div>

                <h3 className={styles.benefitTitle}>
                  {benefit.title}
                </h3>

                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Benefits;