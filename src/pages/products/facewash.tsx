import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Image from "next/image";
import facewash from "../../../public/assets/facewash.jpeg";
import facewashHowToUse from "../../../public/assets/facewash_how_to_use.png";

const FacewashPage = () => {
  return (
    <>
      <SEO
        title="Vakro Glo Depigmenting Facewash for Oily & Acne Prone Skin | Vakro Pharma"
        description="Vakro Facewash gently cleanses excess oil, hepls in depigmentation, dirt and impurities while helping prevent acne. Dermatologist formulated skincare designed for Indian skin."
        keywords="facewash for oily skin India, acne facewash, dermatologist facewash India, vakro facewash, best facewash, depigmenting facewash, daily using facewash"
        url="https://www.vakropharma.com/products/facewash"
      />

      {/* Product Schema for Google */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Vakro Depigmenting Facewash",
                "image": "https://www.vakropharma.com/assets/facewash.jpeg",
                "description": "Depigmenting facewash for oily and acne prone skin.",
                "brand": {
                "@type": "Brand",
                "name": "Vakro Pharma"
                },
                "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "299",
                "availability": "https://schema.org/InStock"
                }
            })
            }}
        />

      <Navbar source="product" />

      <main className="product-page">
        {/* HERO */}
        <section className="product-hero">
          <div className="product-container">
            
            <div className="product-image">
              <Image
                src={facewash}
                alt="Vakro Depigmenting Facewash for oily and acne prone skin"
                width={420}
                height={420}
                sizes="(max-width: 768px) 100vw, 520px"
                style={{ width: "70%", height: "auto" }}
                priority
              />
            </div>

            <div className="product-info">
              <h1>Vakro Depigmenting Facewash</h1>

              <p className="product-subtitle">
                Gentle cleansing for oily & acne prone skin
              </p>

              {/* PRICE SECTION */}
              <div className="price-section">
                {/* <span className="price">₹299</span> */}
                <span className="price">MRP ₹299</span>
                {/* <span className="discount">Save 14%</span> */}
              </div>

              <p className="product-description">
                Depigmenting Facewash formulated to gently cleanse while helping reduce the appearance of dark spots, pigmentation, tanning, and uneven skin tone. Powered with advanced brightening actives and soothing botanicals, this daily-use facewash supports melanin control, restores natural radiance, and leaves skin visibly clearer, fresher, and balanced without over-drying.
              </p>

              <ul className="product-benefits">
                <li>Deep pore cleansing</li>
                <li>Reduce dark spots </li>
                <li>Helps reduce acne breakouts</li>
                <li>Gentle enough for daily use</li>
                <li>Hepls in Depigmentation</li>
              </ul>

              <a
                href="https://wa.me/919286382701"
                className="buy-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="ingredients-section">

            <div className="ingredients-container">

                <h2 className="section-title">Key Ingredients</h2>

                <div className="ingredients-grid">

                <div className="ingredient-card">
                    <div className="ingredient-icon">🧪</div>
                    <h3>Salicylic Acid</h3>
                    <p>Helps unclog pores and control acne.</p>
                </div>

                <div className="ingredient-card">
                    <div className="ingredient-icon">💧</div>
                    <h3>Niacinamide</h3>
                    <p>Controls excess oil and improves skin texture.</p>
                </div>

                <div className="ingredient-card">
                    <div className="ingredient-icon">✨</div>
                    <h3>Glutathione</h3>
                    <p>Antioxidant that helps brighten skin tone.</p>
                </div>

                </div>

            </div>

        </section>

        {/* HOW TO USE */}
        <section className="usage-section">

            <div className="usage-container">

                <div className="usage-image">
                    <Image
                        src={facewashHowToUse}
                        alt="How to use Vakro Depigmenting Facewash"
                        width={800}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 520px"
                        style={{ width: "100%", height: "auto" }}
                        priority
                    />
                </div>

                <div className="usage-content">

                <h2>How to Use</h2>

                <ol>
                    <li>Wet your face with lukewarm water</li>
                    <li>Apply a small amount of facewash</li>
                    <li>Massage gently in circular motion</li>
                    <li>Rinse thoroughly and pat dry</li>
                    <li>Use twice daily for best results</li>
                </ol>

                </div>

            </div>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default FacewashPage;