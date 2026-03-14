import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Image from "next/image";
import { Droplets, ShieldCheck, Sparkles, Leaf } from "lucide-react";

import moisturizerImg from "../../../public/assets/moisturiser.jpeg";
import moisturizerUse from "../../../public/assets/moisturizer_how_to_use.png";

const FaceMoisturizer = () => {
  return (
    <>
      <SEO
        title="Vakro Hydrating Face Moisturizer | Deep Hydration & Skin Barrier Protection"
        description="Vakro Hydrating Face Moisturizer delivers long-lasting hydration with skin barrier repair ingredients. Dermatologist tested formula for smooth, healthy and glowing skin."
        keywords="vakro moisturizer, face moisturizer, hydrating moisturizer, vakro pharma skincare"
        url="https://www.vakropharma.com/products/face-moisturizer"
      />


      {/* Product Schema for Google */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Vakro Aqualite Face Moisturizer",
                "image": "https://www.vakropharma.com/assets/moisturiser.jpeg",
                "description": "Vakro Aqualite face moisturizer for oily and acne prone skin.",
                "brand": {
                "@type": "Brand",
                "name": "Vakro Pharma"
                },
                "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "399",
                "availability": "https://schema.org/InStock"
                }
            })
            }}
        />

      <Navbar source="product" />
      
      <main className="product-page">
        <section className="moisturizer-hero">
            <div className="container hero-grid">

            <div className="hero-image">
                <Image
                    src={moisturizerImg}
                    alt="Vakro Aqualite Face Moisturizer Gel"
                    width={420}
                    height={420}
                    sizes="(max-width: 768px) 100vw, 520px"
                    style={{ width: "70%", height: "auto" }}
                    priority
                />
            </div>

            <div className="hero-content">
                <h1>Vakro Aqualite Face Moisturizer Gel</h1>

                <p className="tagline">
                Lightweight daily moisturizer designed to deeply hydrate,
                repair skin barrier and keep your skin soft and radiant.
                </p>

                <div className="price">₹399</div>

                <ul className="features">
                <li><Droplets size={18}/> Deep hydration</li>
                <li><ShieldCheck size={18}/> Skin barrier protection</li>
                <li><Leaf size={18}/> Gentle & dermatologist tested</li>
                <li><Sparkles size={18}/>Non-Greasy, Non-Comedogenic & Light Weight</li>
                </ul>
            </div>

            </div>
        </section>

        {/* BENEFITS */}

        <section className="moisturizer-benefits">
            <h2>Why Your Skin Will Love It</h2>

            <div className="benefit-grid">

            <div className="benefit-card">
                <Droplets size={30}/>
                <h3>24 Hour Hydration</h3>
                <p>
                Advanced moisture lock formula hydrates the skin deeply
                and prevents dryness throughout the day.
                </p>
            </div>

            <div className="benefit-card">
                <ShieldCheck size={30}/>
                <h3>Barrier Repair</h3>
                <p>
                Helps strengthen the natural skin barrier and protects
                from environmental stress.
                </p>
            </div>

            <div className="benefit-card">
                <Sparkles size={30}/>
                <h3>Smooth Skin</h3>
                <p>
                Improves skin texture and leaves the skin soft,
                supple and glowing.
                </p>
            </div>

            </div>
        </section>

        {/* INGREDIENTS */}

        <section className="moisturizer-ingredients">

            <h2>Key Ingredients</h2>

            <div className="ingredient-grid">

            <div className="ingredient-card">
                <h3>Hyaluronic Acid</h3>
                <p>Deeply hydrates skin and improves elasticity.</p>
            </div>

            <div className="ingredient-card">
                <h3>Ceramides</h3>
                <p>Strengthens the skin barrier and locks moisture.</p>
            </div>

            <div className="ingredient-card">
                <h3>Shea Butter</h3>
                <p>Nourishes skin and prevents dryness.</p>
            </div>

            <div className="ingredient-card">
                <h3>Oat Extract</h3>
                <p>Soothes irritated skin and improves skin comfort.</p>
            </div>

            </div>

        </section>

        {/* HOW TO USE */}

        <section className="moisturizer-usage">

            <div className="usage-grid">

            <div className="usage-image">
                <Image
                    src={moisturizerUse}
                    alt="How to use Vakro Aqualite Moisturizer"
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
                <li>Take a small amount of moisturizer.</li>
                <li>Apply evenly on face and neck.</li>
                <li>Massage gently until fully absorbed.</li>
                <li>Use morning and night for best results.</li>
                </ol>

            </div>

            </div>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default FaceMoisturizer;