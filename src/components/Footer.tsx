import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import vakroLogo from "../../public/assets/vakroGreenLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";

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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Image src={vakroLogo} alt="Vakro" className="footer-logo" height={80} width={80}/>
              <h3>Vakro</h3>
            </div>
            <p className="footer-description">
              Premium dermatological care products for radiant, healthy skin.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <button onClick={() => scrollToSection("home")} className="footer-link">Home</button>
              <button onClick={() => scrollToSection("products")} className="footer-link">Products</button>
              <button onClick={() => scrollToSection("benefits")} className="footer-link">About Us</button>
              <button onClick={() => scrollToSection("contact")} className="footer-link">Contact</button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Products</h4>
            <div className="footer-links">
              <button onClick={() => router.push("/products/facewash")} className="footer-link">Face Wash</button>
              <button onClick={() => router.push("/products/facemoisturizer")} className="footer-link">Face Moisturizer</button>
              <button onClick={() => router.push("/products/faceserum")} className="footer-link">Face Serum</button>
              <button onClick={() => router.push("/products/sunscreen")} className="footer-link">Sunscreen</button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="footer-social">
              <button className="footer-social-link" aria-label="Facebook"><Facebook /></button>
              <button className="footer-social-link" aria-label="Instagram"><Instagram /></button>
              <button className="footer-social-link" aria-label="Twitter"><Twitter /></button>
              <button className="footer-social-link" aria-label="YouTube"><Youtube /></button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Vakro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
