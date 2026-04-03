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
  const [menuOpen, setMenuOpen] = useState(false);
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
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          
          {/* LOGO */}
          <div className={styles.logoSection} onClick={() => router.push("/")}>
            <Image src={vakroLogo} alt="Vakro" width={60} height={60} className={styles.logo}/>
            <h1 className={styles.brand}>Vakro</h1>
          </div>

          {/* DESKTOP LINKS */}
          <div className={styles.links}>
            {source === "product" ? (
              <button onClick={() => router.push("/")} className={styles.primaryBtn}>Home</button>
            ) : (
              <button onClick={() => scrollToSection("home")} className={styles.link}>Home</button>
            )}

            {source !== "product" && (
              <>
                <button onClick={() => scrollToSection("products")} className={styles.link}>Products</button>
                {/* <button onClick={() => router.push("/about")} className={styles.link}>About Us</button> */}
                <button onClick={() => scrollToSection("benefits")} className={styles.link}>Why Us</button>
                <button onClick={() => scrollToSection("contact")} className={styles.link}>Contact</button>
                <button onClick={() => scrollToSection("contact")} className={styles.primaryBtn}>Get Started</button>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={() => scrollToSection("home")}>Home</button>
          {source !== "product" && (
            <>
              <button onClick={() => scrollToSection("products")}>Products</button>
              {/* <button onClick={() => router.push("/about")}>About Us</button> */}
              <button onClick={() => scrollToSection("benefits")}>Why Us</button>
              <button onClick={() => scrollToSection("contact")}>Contact</button>
            </>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;