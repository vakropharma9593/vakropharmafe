import heroImage from "../../public/assets/vakroallproducts.jpeg";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-section gradient-hero">
      <div className="hero-bg">
        <div className="hero-bg-circle-1" />
        <div className="hero-bg-circle-2" />
      </div>
      
      <div className="container hero-content">
        <div className="hero-grid">
          <div className="hero-text animate-fade-in">
            <div className="hero-badge">
              <Sparkles style={{width: '1rem', height: '1rem'}} />
              Dermatologist Tested & Approved
            </div>
            <h1 className="hero-title">
              Advanced Skincare Solutions for Acne, Pigmentation & Sun Protection
            </h1>
            <p className="hero-description">
              Vakro brings dermatologist-inspired skincare powered by clinically proven ingredients like Salicylic Acid, Azelaic Acid, Niacinamide, Ceramides, and SPF 50+ protection to target acne, dark spots, excess oil, and sun damage.
            </p>
            <div className="hero-buttons">
              <button
                onClick={scrollToProducts}
                className="btn btn-lg btn-gradient-primary"
                style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
              >
                Explore Products
                <ArrowRight style={{width: '1.25rem', height: '1.25rem'}} />
              </button>
              {/* <button className="btn btn-lg btn-outline">
                Learn More
              </button> */}
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">4</div>
                <div className="hero-stat-label">Premium Products</div>
              </div>
              <div className="hero-divider" />
              <div className="hero-stat">
                <div className="hero-stat-number">100%</div>
                <div className="hero-stat-label">Natural Ingredients</div>
              </div>
              <div className="hero-divider" />
              <div className="hero-stat">
                <div className="hero-stat-number">1K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="hero-image-container animate-fade-in delay-200">
            <div className="hero-image-wrapper">
              <Image
                src={heroImage}
                height={616}
                width={647}
                alt="Premium skincare products"
                className="hero-image"
              />
            </div>
            <div className="hero-image-glow-1" />
            <div className="hero-image-glow-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
