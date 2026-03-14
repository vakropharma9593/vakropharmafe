import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Image from "next/image";
import { Sparkles, Droplets, ShieldCheck, Sun } from "lucide-react";

import faceserum from "../../../public/assets/faceserum.jpeg";
import faceserumusage from "../../../public/assets/serum_how_to_use.png";

const FaceSerum = () => {
  return (
    <>
      <SEO
        title="Vakro Face Serum | Brightening & Skin Repair Serum"
        description="Vakro Face Serum helps brighten skin tone, reduce pigmentation and improve skin texture. Lightweight dermatologist tested serum for radiant healthy skin."
        keywords="vakro serum, face serum, skin brightening serum, vakro pharma skincare, best face serum, affordable face serum"
        url="https://www.vakropharma.com/products/faceserum"
      />

      {/* Product Schema for Google */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Vakro lite Face Serum",
                "image": "https://www.vakropharma.com/assets/faceserum.jpeg",
                "description": "Vakro lite face serum for oily and acne prone skin.",
                "brand": {
                "@type": "Brand",
                "name": "Vakro Pharma"
                },
                "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "699",
                "availability": "https://schema.org/InStock"
                }
            })
            }}
        />

      <Navbar source="product" />
        <main className="product-page">
      {/* HERO */}

        <section className="serum-hero">
            <div className="container serum-hero-grid">

            <div className="serum-image">
                <Image
                    src={faceserum}
                    alt="Vakro lite anti acne and depigmenting face serum"
                    width={420}
                    height={420}
                    sizes="(max-width: 768px) 100vw, 520px"
                    style={{ width: "70%", height: "auto" }}
                    priority
                />
            </div>

            <div className="serum-content">

                <h1>Brightening Face Serum</h1>

                <p className="tagline">
                A lightweight serum formulated to improve skin tone,
                reduce pigmentation and restore natural glow.
                </p>

                <div className="price">₹699</div>

                <ul className="serum-features">
                <li><Sparkles size={18}/> Brightens skin tone</li>
                <li><Droplets size={18}/> Deep hydration</li>
                <li><ShieldCheck size={18}/> Skin barrier repair</li>
                <li><Sun size={18}/> Reduces pigmentation</li>
                </ul>

            </div>

            </div>
        </section>

        {/* BENEFITS */}

        <section className="serum-benefits">

            <h2>Why Choose Vakro Face Serum</h2>

            <div className="benefit-grid">

            <div className="benefit-card">
                <Sparkles size={30}/>
                <h3>Radiant Skin</h3>
                <p>
                Improves skin brightness and promotes healthy glow.
                </p>
            </div>

            <div className="benefit-card">
                <ShieldCheck size={30}/>
                <h3>Repair Skin Barrier</h3>
                <p>
                Helps repair damaged skin and maintain moisture balance.
                </p>
            </div>

            <div className="benefit-card">
                <Droplets size={30}/>
                <h3>Hydrating Formula</h3>
                <p>
                Keeps skin hydrated and smooth without heaviness.
                </p>
            </div>

            </div>

        </section>

        {/* INGREDIENTS */}

        <section className="serum-ingredients">

            <h2>Key Ingredients</h2>

            <div className="ingredient-grid">

            <div className="ingredient-card">
                <h3>Niacinamide</h3>
                <p>Helps reduce pigmentation and improve skin texture.</p>
            </div>

            <div className="ingredient-card">
                <h3>Vitamin C</h3>
                <p>Boosts brightness and promotes glowing skin.</p>
            </div>

            <div className="ingredient-card">
                <h3>Hyaluronic Acid</h3>
                <p>Deep hydration that keeps skin soft and plump.</p>
            </div>

            <div className="ingredient-card">
                <h3>Glutathione</h3>
                <p>Powerful antioxidant for brighter skin tone.</p>
            </div>

            </div>

        </section>

        {/* HOW TO USE */}

        <section className="serum-usage">

            <div className="usage-grid">

            <div className="usage-image">
                <Image
                    src={faceserumusage}
                    alt="How to use Vakro lite serum"
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
                <li>Cleanse your face with a gentle facewash.</li>
                <li>Take 2-3 drops of serum.</li>
                <li>Apply evenly on face and neck.</li>
                <li>Gently pat until fully absorbed.</li>
                <li>Follow with moisturizer and sunscreen.</li>
                </ol>

            </div>

            </div>

        </section>
       </main>

      <Footer />

    </>
  );
};

export default FaceSerum;