import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Image from "next/image";
import { Sun, ShieldCheck, Droplets, Sparkles } from "lucide-react";

import sunscreenImg from "../../../public/assets/sunscreen.jpeg";
import sunscreenUse from "../../../public/assets/sunscreen_how_to_use.png";

const Sunscreen = () => {
  return (
    <>
      <SEO
        title="Vakro Sunscreen SPF 50 | Broad Spectrum Sun Protection"
        description="Vakro Sunscreen SPF 50 protects skin from harmful UVA and UVB rays while keeping your skin hydrated and smooth. Lightweight non-greasy formula for daily sun protection."
        keywords="vakro sunscreen, spf 50 sunscreen, sunscreen for face, vakro pharma skincare, best sunscreen, affordable sunscreen"
        url="https://www.vakropharma.com/products/sunscreen"
      />

      {/* Product Schema for Google */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Vakro lite sunscreen",
                "image": "https://www.vakropharma.com/assets/sunscreen.jpeg",
                "description": "Vakro lite sunscreen for oily and acne prone skin.",
                "brand": {
                "@type": "Brand",
                "name": "Vakro Pharma"
                },
                "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "549",
                "availability": "https://schema.org/InStock"
                }
            })
            }}
        />

      <Navbar source="product" />

      {/* HERO */}
      <main className="product-page">

        <section className="sunscreen-hero">
            <div className="container sunscreen-grid">

            <div className="sunscreen-image">
                <Image
                    src={sunscreenImg}
                    alt="Vakro lite anti acne and depigmenting sunscreen"
                    width={420}
                    height={420}
                    sizes="(max-width: 768px) 100vw, 520px"
                    style={{ width: "70%", height: "auto" }}
                    priority
                />
            </div>

            <div className="sunscreen-content">

                <h1>SPF 50 Sunscreen</h1>

                <p className="tagline">
                Broad spectrum SPF 50 sunscreen that protects skin from harmful
                UV rays while keeping it hydrated and smooth.
                </p>

                <div className="price">₹549</div>

                <ul className="sunscreen-features">
                <li><Sun size={18}/> SPF 50 UV protection</li>
                <li><ShieldCheck size={18}/> Prevents sun damage</li>
                <li><Droplets size={18}/> Hydrating formula</li>
                <li><Sparkles size={18}/> Lightweight & non-greasy</li>
                </ul>

            </div>

            </div>
        </section>

        {/* BENEFITS */}

        <section className="sunscreen-benefits">

            <h2>Why Choose Vakro Sunscreen</h2>

            <div className="benefit-grid">

            <div className="benefit-card">
                <Sun size={30}/>
                <h3>Broad Spectrum Protection</h3>
                <p>
                Protects your skin from harmful UVA and UVB rays
                responsible for sunburn and premature aging.
                </p>
            </div>

            <div className="benefit-card">
                <ShieldCheck size={30}/>
                <h3>Prevents Sun Damage</h3>
                <p>
                Helps prevent tanning, pigmentation and
                long-term sun damage.
                </p>
            </div>

            <div className="benefit-card">
                <Droplets size={30}/>
                <h3>Hydrating Formula</h3>
                <p>
                Moisturizing ingredients keep skin soft,
                smooth and hydrated.
                </p>
            </div>

            </div>

        </section>

        {/* INGREDIENTS */}

        <section className="sunscreen-ingredients">

            <h2>Key Ingredients</h2>

            <div className="ingredient-grid">

            <div className="ingredient-card">
                <h3>Zinc Oxide</h3>
                <p>Provides strong protection from harmful UV rays.</p>
            </div>

            <div className="ingredient-card">
                <h3>Vitamin E</h3>
                <p>Antioxidant that protects skin from environmental damage.</p>
            </div>

            <div className="ingredient-card">
                <h3>Niacinamide</h3>
                <p>Helps improve skin tone and reduce pigmentation.</p>
            </div>

            <div className="ingredient-card">
                <h3>Aloe Extract</h3>
                <p>Soothes skin and prevents dryness caused by sun exposure.</p>
            </div>

            </div>

        </section>

        {/* HOW TO USE */}

        <section className="sunscreen-usage">

            <div className="usage-grid">

            <div className="usage-image">
                <Image
                    src={sunscreenUse}
                    alt="How to use Vakro lite Depigmenting sunscreen"
                    width={800}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 520px"
                    style={{ width: "100%", height: "auto" }}
                    priority
                />
            </div>

            <div className="usage-steps">

                <h2>How to Use</h2>

                <ol>
                <li>Apply sunscreen on clean face and neck.</li>
                <li>Use generous amount before sun exposure.</li>
                <li>Apply 15 minutes before going outdoors.</li>
                <li>Reapply every 2-3 hours for best protection.</li>
                <li>Use daily even on cloudy days.</li>
                </ol>

            </div>

            </div>

        </section>
      </main>
      <Footer />

    </>
  );
};

export default Sunscreen;