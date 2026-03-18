import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductPage from "@/components/ProductPage";

import { Sparkles, Droplets, ShieldCheck, Leaf } from "lucide-react";

import facewash from "../../../public/assets/facewash.jpeg";
import facewashHowToUse from "../../../public/assets/facewash_how_to_use.png";

const FacewashPage = () => {

  const features = [
    { icon: <Droplets size={18}/>, text: "Deep pore cleansing" },
    { icon: <Sparkles size={18}/>, text: "Helps reduce dark spots" },
    { icon: <ShieldCheck size={18}/>, text: "Helps prevent acne breakouts" },
    { icon: <Leaf size={18}/>, text: "Gentle for daily use" }
  ];

  const benefits = [
    {
      icon: <Droplets size={30}/>,
      title: "Deep Cleansing",
      description:
        "Removes excess oil, dirt and impurities while keeping the skin fresh and balanced."
    },
    {
      icon: <Sparkles size={30}/>,
      title: "Depigmentation Support",
      description:
        "Helps reduce dark spots, tanning and uneven skin tone with brightening ingredients."
    },
    {
      icon: <ShieldCheck size={30}/>,
      title: "Acne Control",
      description:
        "Helps unclog pores and control acne-causing impurities for clearer skin."
    }
  ];

  const ingredients = [
    {
      name: "Salicylic Acid",
      description: "Helps unclog pores and control acne."
    },
    {
      name: "Niacinamide",
      description: "Controls excess oil and improves skin texture."
    },
    {
      name: "Glutathione",
      description: "Powerful antioxidant that helps brighten skin tone."
    }
  ];

  const usageSteps = [
    "Wet your face with lukewarm water.",
    "Apply a small amount of facewash.",
    "Massage gently in circular motion.",
    "Rinse thoroughly and pat dry.",
    "Use twice daily for best results."
  ];

  return (
    <>
      <SEO
        title="Vakro Glo Depigmenting Facewash for Oily & Acne Prone Skin | Vakro Pharma"
        description="Vakro Facewash gently cleanses excess oil, helps in depigmentation and removes dirt while helping prevent acne."
        keywords="facewash for oily skin India, acne facewash, vakro facewash, depigmenting facewash"
        url="https://www.vakropharma.com/products/facewash"
      />

      {/* Product Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Vakro Depigmenting Facewash",
            image: "https://www.vakropharma.com/assets/facewash.jpeg",
            description:
              "Depigmenting facewash for oily and acne prone skin.",
            brand: {
              "@type": "Brand",
              name: "Vakro Pharma"
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "299",
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />

      <Navbar source="product" />

      <ProductPage
        title="Vakro Glo Depigmenting Facewash"
        price="299"
        heroImage={facewash}
        usageImage={facewashHowToUse}
        tagline="Depigmenting facewash formulated to cleanse excess oil, reduce dark spots and promote clear, healthy skin."
        features={features}
        benefitsTitle="Why Choose Vakro Facewash"
        benefits={benefits}
        ingredients={ingredients}
        usageSteps={usageSteps}
        product="facewash"
      />

      <Footer source="product" />
    </>
  );
};

export default FacewashPage;