import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductPage from "@/components/ProductPage";

import { Sun, ShieldCheck, Droplets, Sparkles } from "lucide-react";

import sunscreenImg from "../../../public/assets/sunscreen.jpeg";
import sunscreenUse from "../../../public/assets/sunscreen_how_to_use.png";

const Sunscreen = () => {

  const features = [
    { icon: <Sun size={18}/>, text: "SPF 50 UV protection" },
    { icon: <ShieldCheck size={18}/>, text: "Prevents sun damage" },
    { icon: <Droplets size={18}/>, text: "Hydrating formula" },
    { icon: <Sparkles size={18}/>, text: "Lightweight & non-greasy" }
  ];

  const benefits = [
    {
      icon: <Sun size={30}/>,
      title: "Broad Spectrum Protection",
      description:
        "Protects your skin from harmful UVA and UVB rays responsible for sunburn and premature aging."
    },
    {
      icon: <ShieldCheck size={30}/>,
      title: "Prevents Sun Damage",
      description:
        "Helps prevent tanning, pigmentation and long-term sun damage."
    },
    {
      icon: <Droplets size={30}/>,
      title: "Hydrating Formula",
      description:
        "Moisturizing ingredients keep skin soft, smooth and hydrated throughout the day."
    }
  ];

  const ingredients = [
    {
      name: "Zinc Oxide",
      description: "Provides strong protection from harmful UV rays."
    },
    {
      name: "Vitamin E",
      description: "Antioxidant that protects skin from environmental damage."
    },
    {
      name: "Niacinamide",
      description: "Helps improve skin tone and reduce pigmentation."
    },
    {
      name: "Aloe Extract",
      description: "Soothes skin and prevents dryness caused by sun exposure."
    }
  ];

  const usageSteps = [
    "Apply sunscreen on clean face and neck.",
    "Use generous amount before sun exposure.",
    "Apply 15 minutes before going outdoors.",
    "Reapply every 2-3 hours for best protection.",
    "Use daily even on cloudy days."
  ];

  return (
    <>
      <SEO
        title="Vakro Sunscreen SPF 50 | Broad Spectrum Sun Protection"
        description="Vakro Sunscreen SPF 50 protects skin from harmful UVA and UVB rays while keeping skin hydrated and smooth."
        keywords="vakro sunscreen, spf 50 sunscreen, sunscreen for face, vakro pharma skincare"
        url="https://www.vakropharma.com/products/sunscreen"
      />

      {/* Product Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Vakro Lite Sunscreen",
            image: "https://www.vakropharma.com/assets/sunscreen.jpeg",
            description:
              "Vakro lite sunscreen for oily and acne prone skin.",
            brand: {
              "@type": "Brand",
              name: "Vakro Pharma"
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "549",
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />

      <Navbar source="product" />

      <ProductPage
        title="Vakro Lite SPF 50 Sunscreen"
        price="549"
        heroImage={sunscreenImg}
        usageImage={sunscreenUse}
        tagline="Broad spectrum SPF 50 sunscreen that protects skin from harmful UV rays while keeping it hydrated and smooth."
        features={features}
        benefitsTitle="Why Choose Vakro Sunscreen"
        benefits={benefits}
        ingredients={ingredients}
        usageSteps={usageSteps}
      />

      <Footer />
    </>
  );
};

export default Sunscreen;