import { useState, useEffect } from "react";
import vakroLogo from "../../public/assets/darkGreenLogo.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/navbar.module.css";

type NavbarProps = {
  source?: string;
};

const Navbar: React.FC<NavbarProps> = ({ source }) => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          
          <div className={styles.logoSection} onClick={() => router.push("/")}>
            <Image
              src={vakroLogo}
              alt="Vakro"
              width={60}
              height={60}
              className={styles.logo}
            />
            <h1 className={styles.brand}>Vakro</h1>
          </div>

          <div className={styles.links}>

            {source === "product" ? (
              <button
                onClick={() => router.push("/")}
                className={styles.primaryBtn}
              >
                Home
              </button>
            ) : (
              <button
                onClick={() => scrollToSection("home")}
                className={styles.link}
              >
                Home
              </button>
            )}

            {source === "product" ? null : (
              <button
                onClick={() => scrollToSection("products")}
                className={styles.link}
              >
                Products
              </button>
            )}

            {source === "product" ? null : (
              <button
                onClick={() => scrollToSection("benefits")}
                className={styles.link}
              >
                Why Us
              </button>
            )}

            {source === "product" ? null : (
              <button
                onClick={() => scrollToSection("contact")}
                className={styles.link}
              >
                Contact
              </button>
            )}

            {source === "product" ? null : (
              <button
                onClick={() => scrollToSection("contact")}
                className={styles.primaryBtn}
              >
                Get Started
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;