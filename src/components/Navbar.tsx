import { useState, useEffect } from "react";
import vakroLogo from "../../public/assets/vakro-logo.png";
import Image from "next/image";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Image src={vakroLogo} alt="Vakro" width={40} height={40} />
            <h1 className="navbar-brand">Vakro</h1>
          </div>
          <div className="navbar-links">
            <button
              onClick={() => scrollToSection("home")}
              className="navbar-link"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="navbar-link"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="navbar-link"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="navbar-link"
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="btn btn-default btn-lg btn-gradient-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
