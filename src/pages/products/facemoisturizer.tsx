import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductPage from "@/components/ProductPage";

import { Droplets, ShieldCheck, Sparkles, Leaf } from "lucide-react";

import moisturizerImg from "../../../public/assets/moisturiser.jpeg";
import moisturizerUse from "../../../public/assets/moisturizer_how_to_use.png";

const FaceMoisturizer = () => {

  const features = [
    { icon: <Droplets size={18}/>, text: "Deep hydration" },
    { icon: <ShieldCheck size={18}/>, text: "Skin barrier protection" },
    { icon: <Leaf size={18}/>, text: "Gentle & dermatologist tested" },
    { icon: <Sparkles size={18}/>, text: "Non-Greasy, Non-Comedogenic & Lightweight" }
  ];

  const benefits = [
    {
      icon: <Droplets size={30}/>,
      title: "24 Hour Hydration",
      description:
        "Advanced moisture lock formula hydrates the skin deeply and prevents dryness throughout the day."
    },
    {
      icon: <ShieldCheck size={30}/>,
      title: "Barrier Repair",
      description:
        "Helps strengthen the natural skin barrier and protects from environmental stress."
    },
    {
      icon: <Sparkles size={30}/>,
      title: "Smooth Skin",
      description:
        "Improves skin texture and leaves the skin soft, supple and glowing."
    }
  ];

  const ingredients = [
    {
      name: "Hyaluronic Acid",
      description: "Deeply hydrates skin and improves elasticity."
    },
    {
      name: "Ceramides",
      description: "Strengthens the skin barrier and locks moisture."
    },
    {
      name: "Shea Butter",
      description: "Nourishes skin and prevents dryness."
    },
    {
      name: "Oat Extract",
      description: "Soothes irritated skin and improves skin comfort."
    }
  ];

  const usageSteps = [
    "Cleanse your face with a gentle facewash.",
    "Take a small amount of moisturizer.",
    "Apply evenly on face and neck.",
    "Massage gently until fully absorbed.",
    "Use morning and night for best results."
  ];

  return (
    <>
      <SEO
        title="Vakro Hydrating Face Moisturizer | Deep Hydration & Skin Barrier Protection"
        description="Vakro Hydrating Face Moisturizer delivers long-lasting hydration with skin barrier repair ingredients."
        keywords="vakro moisturizer, face moisturizer, hydrating moisturizer, vakro pharma skincare"
        url="https://www.vakropharma.com/products/face-moisturizer"
      />

      {/* Product Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Vakro Aqualite Face Moisturizer",
            image: "https://www.vakropharma.com/assets/moisturiser.jpeg",
            description:
              "Vakro Aqualite face moisturizer for oily and acne prone skin.",
            brand: {
              "@type": "Brand",
              name: "Vakro Pharma",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "399",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <Navbar source="product" />

      <ProductPage
        title="Vakro Aqualite Face Moisturizer Gel"
        price="399"
        heroImage={moisturizerImg}
        usageImage={moisturizerUse}
        tagline="Lightweight daily moisturizer designed to deeply hydrate, repair skin barrier and keep your skin soft and radiant."
        features={features}
        benefitsTitle="Why Your Skin Will Love It"
        benefits={benefits}
        ingredients={ingredients}
        usageSteps={usageSteps}
        product="faceMoisturizer"
      />

      <Footer source="product" />
    </>
  );
};

export default FaceMoisturizer;