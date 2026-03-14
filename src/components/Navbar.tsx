import { useState, useEffect } from "react";
import vakroLogo from "../../public/assets/vakroGreenLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";

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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Image src={vakroLogo} alt="Vakro" width={80} height={80} style={{ transform: "scale(1.5)", transformOrigin: "center" }} />
            <h1 className="navbar-brand">Vakro</h1>
          </div>
          <div className="navbar-links">
            {source === "product" ? 
              <button
                onClick={() => router.push("/")}
                className="btn btn-default btn-lg btn-gradient-primary"
              >
                Home
              </button>
             : 
              <button
                onClick={() => scrollToSection("home")}
                className="navbar-link"
              >
                Home
              </button>
            }
            {source === "product" ? null : <button
              onClick={() => scrollToSection("products")}
              className="navbar-link"
            >
              Products
            </button>}
            {source === "product" ? null :<button
              onClick={() => scrollToSection("benefits")}
              className="navbar-link"
            >
              Why Us
            </button>}
            {source === "product" ? null :<button
              onClick={() => scrollToSection("contact")}
              className="navbar-link"
            >
              Contact
            </button>}
            {source === "product" ? null :<button
              onClick={() => scrollToSection("contact")}
              className="btn btn-default btn-lg btn-gradient-primary"
            >
              Get Started
            </button>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
