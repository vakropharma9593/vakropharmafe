import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import vakroLogo from "../../public/assets/vakro-logo.png";
import Image from "next/image";

const Footer = () => {
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
              <Image src={vakroLogo} alt="Vakro" className="footer-logo" height={40} width={40}/>
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
              <button className="footer-link">Face Care</button>
              <button className="footer-link">Hair Care</button>
              <button className="footer-link">Body Care</button>
              <button className="footer-link">Sun Care</button>
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
