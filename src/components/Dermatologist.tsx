import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
// import Image from "next/image";
import styles from "../styles/dermatologist.module.css";

// import doctorImg from "../../public/assets/doctor.jpg";

const Dermatologist = () => {
  return (
    <>
      <SEO
        title="Dermatologist Behind Vakro Pharma | MD Dermatology AIIMS"
        description="Vakro Pharma skincare is formulated under the guidance of a dermatologist trained at AIIMS. Learn about the medical expertise behind Vakro products."
        keywords="vakro dermatologist, aiims dermatologist skincare, dermatologist skincare brand india"
        url="https://www.vakropharma.com/dermatologist"
      />

      <Navbar />

      <main className={styles.page}>

        <section className={styles.hero}>
          <div className={styles.container}>

            <div className={styles.grid}>

              <div className={styles.image}>
                {/* <Image
                  src={doctorImg}
                  alt="Vakro Pharma Dermatologist"
                  priority
                /> */}
              </div>

              <div className={styles.content}>

                <h1>Dermatologist Behind Vakro Pharma</h1>

                <h3>
                  Dr. [Brother Name]
                </h3>

                <p className={styles.degree}>
                  MBBS – AIIMS Rishikesh  
                  <br/>
                  MD Dermatology – AIIMS Jodhpur
                </p>

                <p>
                  Vakro Pharma was created with the vision of bringing
                  dermatologist-inspired skincare to everyone. Our products
                  combine medical science with safe ingredients to solve
                  real skin concerns like acne, pigmentation and sun damage.
                </p>

              </div>

            </div>

          </div>
        </section>

        <section className={styles.philosophy}>
          <div className={styles.container}>

            <h2>Our Dermatology Philosophy</h2>

            <div className={styles.cards}>

              <div className={styles.card}>
                <h3>Science First</h3>
                <p>
                  Every formulation is based on dermatological research
                  and evidence-based ingredients.
                </p>
              </div>

              <div className={styles.card}>
                <h3>Safe for Indian Skin</h3>
                <p>
                  Designed for Indian climate, pollution exposure
                  and common skin concerns.
                </p>
              </div>

              <div className={styles.card}>
                <h3>Affordable Dermatology</h3>
                <p>
                  Dermatologist-level skincare should be accessible
                  to everyone, not just premium clinics.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Dermatologist;