import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductPage from "@/components/ProductPage";

import { Sparkles, Droplets, ShieldCheck, Sun } from "lucide-react";

import faceserum from "../../../public/assets/faceserum.jpeg";
import faceserumusage from "../../../public/assets/serum_how_to_use.png";

const FaceSerum = () => {

  const features = [
    { icon: <Sparkles size={18}/>, text: "Brightens skin tone" },
    { icon: <Droplets size={18}/>, text: "Deep hydration" },
    { icon: <ShieldCheck size={18}/>, text: "Skin barrier repair" },
    { icon: <Sun size={18}/>, text: "Reduces pigmentation" }
  ];

  const benefits = [
    {
      icon: <Sparkles size={30}/>,
      title: "Radiant Skin",
      description: "Improves skin brightness and promotes natural glow."
    },
    {
      icon: <ShieldCheck size={30}/>,
      title: "Barrier Repair",
      description: "Helps repair damaged skin and strengthen barrier."
    },
    {
      icon: <Droplets size={30}/>,
      title: "Hydrating Formula",
      description: "Keeps skin hydrated and smooth."
    }
  ];

  const ingredients = [
    {
      name: "Niacinamide",
      description: "Reduces pigmentation and improves skin texture."
    },
    {
      name: "Vitamin C",
      description: "Boosts brightness and glow."
    },
    {
      name: "Hyaluronic Acid",
      description: "Deep hydration and plump skin."
    },
    {
      name: "Glutathione",
      description: "Powerful antioxidant for brighter tone."
    }
  ];

  const usageSteps = [
    "Cleanse your face with a gentle facewash.",
    "Take 2-3 drops of serum.",
    "Apply evenly on face and neck.",
    "Gently pat until fully absorbed.",
    "Follow with moisturizer and sunscreen."
  ];

  return (
    <>
      <SEO
        title="Vakro Face Serum | Brightening & Skin Repair Serum"
        description="Vakro Face Serum helps brighten skin tone, reduce pigmentation and improve skin texture."
        keywords="vakro serum, face serum, skin brightening serum"
        url="https://www.vakropharma.com/products/faceserum"
      />

      <Navbar source="product"/>

      <ProductPage
        title="Vakro Lite Brightening Face Serum"
        price="699"
        heroImage={faceserum}
        usageImage={faceserumusage}
        tagline="A lightweight serum formulated to brighten skin tone and restore natural glow."
        features={features}
        benefitsTitle="Why Choose Vakro Face Serum"
        benefits={benefits}
        ingredients={ingredients}
        usageSteps={usageSteps}
      />

      <Footer/>
    </>
  );
};

export default FaceSerum;