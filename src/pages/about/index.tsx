// aboutUs.tsx
"use client";

import { motion } from "framer-motion";
import styles from "./index.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <motion.div initial="hidden" animate="show" variants={fade} className={styles.heroContent}>
          <h1>Skincare, Reimagined for India</h1>
          <p>From villages to metros — affordable, accessible, and science-backed.</p>
          <button className={styles.primaryBtn}>Explore Products</button>
        </motion.div>
      </section>

      {/* STORY */}
      <section className={styles.section}>
        <motion.div variants={fade} initial="hidden" whileInView="show" className={styles.story}>
          <h2>Our Story</h2>
          <p>
            Vakro began in Piragi — a small village of just 25 families. A farmer’s vision, combined with knowledge from IIT and AIIMS, created a brand rooted in reality and powered by science.
          </p>
          <p>
            We saw a gap — skincare was either too expensive or unavailable. Vakro was built to solve this.
          </p>
        </motion.div>
      </section>

      {/* FOUNDER */}
      <section className={styles.sectionAlt}>
        <div className={styles.split}>
          <img src="https://via.placeholder.com/500x600" className={styles.image} />
          <motion.div variants={fade} initial="hidden" whileInView="show">
            <h2>Founder</h2>
            <p className={styles.founderName}>Rajveer Singh</p>
            <p>
              A farmer with decades of real-life understanding, who believed skincare should not be limited by geography or income.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DOCTOR VERIFIED */}
      <section className={styles.section}>
        <div className={styles.doctorCard}>
          <img src="https://via.placeholder.com/120" className={styles.avatar} />
          <h3>Dr. Aarav Sharma</h3>
          <p className={styles.credential}>MD Dermatology (AIIMS)</p>
          <span className={styles.badge}>✔ Doctor Verified</span>
          <p className={styles.doctorText}>
            &quot;We design skincare that is simple, effective, and accessible for everyone.&quot;
          </p>
        </div>
      </section>

      {/* USP */}
      <section className={styles.section}>
        <h2 className={styles.center}>Why Vakro</h2>
        <div className={styles.grid}>
          {["Affordable","Accessible","Dermatologist-backed","For all skin types"].map((item, i) => (
            <motion.div key={i} className={styles.card} whileHover={{ y: -6 }}>
              {item}
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className={styles.sectionAlt}>
        <h2 className={styles.center}>Real Results</h2>
        <div className={styles.carousel}>
          {[1,2,3].map((_,i)=>(
            <img key={i} src="https://via.placeholder.com/300x350" className={styles.carouselImg}/>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className={styles.section}>
        <motion.div className={styles.story} variants={fade} initial="hidden" whileInView="show">
          <h2>Our Mission</h2>
          <p>
            To make skincare accessible, affordable, and understandable for everyone — from metro cities to the smallest villages.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Start Your Skincare Journey</h2>
        <p>Simple. Effective. Made for you.</p>
        <button className={styles.goldBtn}>Shop Now</button>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;
