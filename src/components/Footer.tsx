import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import vakroLogo from "../../public/assets/goldenLogo.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/footer.module.css";

const Footer = () => {

  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (

    <footer className={styles.footer}>

      <div className={styles.container}>

        <div className={styles.grid}>

          {/* Brand */}

          <div className={styles.brandSection}>

            <div className={styles.brand} onClick={() => router.push("/")}>

              <Image
                src={vakroLogo}
                alt="Vakro Dermatology Skincare"
                height={70}
                width={70}
                className={styles.logo}
              />

              <h3 className={styles.brandName}>Vakro</h3>

            </div>

            <p className={styles.description}>
              Premium dermatological skincare developed with scientific
              formulations to deliver radiant, healthy skin.
            </p>

            <p className={styles.tagline}>
              Trusted Dermatology Inspired Skincare
            </p>

          </div>

          {/* Quick Links */}

          <div className={styles.section}>

            <h4 className={styles.heading}>Quick Links</h4>

            <div className={styles.links}>

              <button onClick={() => scrollToSection("home")} className={styles.link}>Home</button>

              <button onClick={() => scrollToSection("products")} className={styles.link}>Products</button>

              <button onClick={() => scrollToSection("benefits")} className={styles.link}>About Us</button>

              <button onClick={() => scrollToSection("contact")} className={styles.link}>Contact</button>

              <button onClick={() => router.push("/faq")} className={styles.link}>FAQ</button>

            </div>

          </div>

          {/* Products */}

          <div className={styles.section}>

            <h4 className={styles.heading}>Products</h4>

            <div className={styles.links}>

              <button onClick={() => router.push("/products/facewash")} className={styles.link}>
                Face Wash
              </button>

              <button onClick={() => router.push("/products/facemoisturizer")} className={styles.link}>
                Face Moisturizer
              </button>

              <button onClick={() => router.push("/products/faceserum")} className={styles.link}>
                Face Serum
              </button>

              <button onClick={() => router.push("/products/sunscreen")} className={styles.link}>
                Sunscreen
              </button>

            </div>

          </div>

          {/* Connect */}

          <div className={styles.section}>

            <h4 className={styles.heading}>Connect With Us</h4>

            <div className={styles.social}>

              <button className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20}/>
              </button>

              <button className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20}/>
              </button>

              <button className={styles.socialLink} aria-label="Twitter">
                <Twitter size={20}/>
              </button>

              <button className={styles.socialLink} aria-label="YouTube">
                <Youtube size={20}/>
              </button>

            </div>

            <div className={styles.contactInfo}>

              <p>Email: info@vakropharma.com</p>

              <p>Phone: +91 9079811724</p>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className={styles.bottom}>

          <p>
            © {currentYear} Vakro Pharma. All rights reserved.
          </p>

          <div className={styles.bottomLinks}>

            <button onClick={() => router.push("/privacy-policy")} className={styles.bottomLink}>
              Privacy Policy
            </button>

            <button onClick={() => router.push("/terms")} className={styles.bottomLink}>
              Terms
            </button>

          </div>

        </div>

      </div>

    </footer>

  );
};

export default Footer;