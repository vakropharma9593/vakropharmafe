import { Sparkles, Droplets, ShieldCheck, Leaf, Sun } from "lucide-react";
import facewash from "../../public/assets/vakro-glo-depigmenting-facewash.webp";
import facewashHowToUse from "../../public/assets/vakro-glo-depigmenting-facewash_how_to_use.webp";
import moisturizerImg from "../../public/assets/vakro-aqua-lite-moisturiser-face-gel.webp";
import moisturizerUse from "../../public/assets/vakro-aqua-lite-moisturiser-face-gel_how_to_use.webp";
import sunscreenImg from "../../public/assets/vakro-lite-depigmenting-fluid-sunscreen.webp";
import sunscreenUse from "../../public/assets/vakro-lite-depigmenting-fluid-sunscreen_how_to_use.webp";
import faceserum from "../../public/assets/vakro-lite-face-serum.webp";
import faceserumusage from "../../public/assets/vakro-lite-face-serum_how_to_use.webp";
import { StaticImageData } from "next/image";

import { ReactNode } from "react";

export type Feature = {
  icon: ReactNode;
  text: string;
};

export type Benefit = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type Ingredient = {
  name: string;
  description: string;
};

export type HomePageData = {
  description: string;
  category: string;
  image: StaticImageData;
  alt: string;
  productLink: string;
};

export type ProductUIData = {
  features: Feature[];
  description: string;
  keywords: string;
  benefits: Benefit[];
  ingredients: Ingredient[];
  usageSteps: string[];
  heroImage: StaticImageData;
  howTOUseImage: StaticImageData;
  tagLine: string;
  homepageData: HomePageData;
};

export const productData = {
  "vakro-glo-depigmenting-facewash": {
    description: "Vakro Facewash gently cleanses excess oil, helps in depigmentation and removes dirt while helping prevent acne.",
    keywords: "facewash for oily skin India, acne facewash, vakro facewash, depigmenting facewash",
    features: [
        { icon: <Droplets size={18}/>, text: "Deep pore cleansing" },
        { icon: <Sparkles size={18}/>, text: "Helps reduce dark spots" },
        { icon: <ShieldCheck size={18}/>, text: "Helps prevent acne breakouts" },
        { icon: <Leaf size={18}/>, text: "Reduce uneven skin tone" }
    ],
    benefits: [
      {
        icon: <Droplets size={30}/>,
        title: "Reduce Dark Spots",
        description:
          "Decrease melanin production and reduce dark spots"
      },
      {
        icon: <Sparkles size={30}/>,
        title: "Skin Brightening",
        description:
          "Reduce uneven skin tone and make skin brighter"
      },
      {
        icon: <ShieldCheck size={30}/>,
        title: "Skin Glow",
        description:
          "Strong antioxidant help to enhance skin glow and reduce even skin tone"
      }
    ],
    ingredients: [
      {
        name: "Kojic Acid",
        description: "Decrease melanin production and reduce dark spots"
      },
      {
        name: "Niacinamide",
        description: "Reduce uneven skin tone and make skin brighter"
      },
      {
        name: "Vit C",
        description: "Strong antioxidant help to enhance skin glow and reduce even skin tone"
      }
    ],
    usageSteps: [
      "Wet your face with lukewarm water.",
      "Apply a small amount of facewash.",
      "Massage gently in circular motion.",
      "Rinse thoroughly and pat dry.",
      "Use twice daily for best results."
    ],
    heroImage: facewash,
    howTOUseImage: facewashHowToUse,
    tagLine: "Depigmenting facewash formulated to cleanse excess oil, reduce dark spots and promote clear, healthy skin.",
    homepageData: {
      description: "Experience the Art of Balanced Skin with Vakro Depigmenting Face Wash.",
      category: "Face Care",
      image: facewash,
      alt: "Vakro Glow Balance Depigmenting Face Wash with Salicylic Acid and Niacinamide",
      productLink: "/products/vakro-glo-depigmenting-facewash",
    }
  },

  "vakro-aqua-lite-moisturiser-face-gel": { 
    description: "Vakro Hydrating Face Moisturizer delivers long-lasting hydration with skin barrier repair ingredients.",
    keywords: "vakro moisturizer, face moisturizer, hydrating moisturizer, vakro pharma skincare",
    features: [
      { icon: <Droplets size={18}/>, text: "Deep hydration" },
      { icon: <ShieldCheck size={18}/>, text: "Skin barrier protection" },
      { icon: <Leaf size={18}/>, text: "Gentle & dermatologist tested" },
      { icon: <Sparkles size={18}/>, text: "Non-Greasy, Non-Comedogenic & Lightweight" }
    ],
    benefits: [
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
    ],
    ingredients: [
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
    ],
    usageSteps: [
      "Cleanse your face with a gentle facewash.",
      "Take a small amount of moisturizer.",
      "Apply evenly on face and neck.",
      "Massage gently until fully absorbed.",
      "Use morning and night for best results."
    ],
    heroImage: moisturizerImg,
    howTOUseImage: moisturizerUse,
    tagLine: "Lightweight daily moisturizer designed to deeply hydrate, repair skin barrier and keep your skin soft and radiant.",
    homepageData: {
      description: "Experience advanced hydration with powerful sun defense in one lightweight formula.",
      category: "Face Care",
      image: moisturizerImg,
      alt: "Vakro Aqualite SPF 50+ Face Moisturizer Gel with 5 Ceramides",
      productLink: "/products/vakro-aqua-lite-moisturiser-face-gel",
    }
  },

  "vakro-lite-depigmenting-fluid-sunscreen": { 
    description: "Vakro Sunscreen SPF 50 protects skin from harmful UVA and UVB rays while keeping skin hydrated and smooth.",
    keywords: "vakro sunscreen, spf 50 sunscreen, sunscreen for face, vakro pharma skincare",
    features: [
      { icon: <Sun size={18}/>, text: "SPF 50 UV protection" },
      { icon: <ShieldCheck size={18}/>, text: "Prevents sun damage" },
      { icon: <Droplets size={18}/>, text: "Hydrating formula" },
      { icon: <Sparkles size={18}/>, text: "Lightweight & non-greasy" },
      { icon: <Droplets size={18}/>, text: "Reduced Dark Spots" },
    ],
    benefits: [
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
    ],
    ingredients: [
      {
        name: "4-butyl resorcinol",
        description: "Strong tyrosinase inhibitor, reduce melanin production, reduce dark spots, improve uneven skin tone."
      },
      {
        name: "Trnaexamic Acid",
        description: ""
      },
      {
        name: "Vitamin E",
        description: "Antioxidant that protects skin from environmental damage."
      },
      {
        name: "Zinc Oxide",
        description: "Provides strong protection from harmful UV rays."
      },
      {
        name: "Niacinamide",
        description: "Helps improve skin tone and reduce pigmentation."
      },
      {
        name: "Aloe Extract",
        description: "Soothes skin and prevents dryness caused by sun exposure."
      },
    ],
    usageSteps: [
      "Apply sunscreen on clean face and neck.",
      "Use generous amount before sun exposure.",
      "Apply 15 minutes before going outdoors.",
      "Reapply every 2-3 hours for best protection.",
      "Use daily even on cloudy days."
    ],
    heroImage: sunscreenImg,
    howTOUseImage: sunscreenUse,
    tagLine: "Broad spectrum SPF 50 sunscreen that protects skin from harmful UV rays while keeping it hydrated and smooth.",
    homepageData: {
      description: "Broad-spectrum SPF 50+ sunscreen that protects from UV damage and helps reduce dark spots for an even-toned glow.",
      category: "Sun Care",
      image: sunscreenImg,
      alt: "Vakro Lite Anti-Pigment SPF 50+ Broad Spectrum Sunscreen",
      productLink: "/products/vakro-lite-depigmenting-fluid-sunscreen",
    }
  },

  "vakro-lite-face-serum": { 
    description: "Vakro Face Serum helps brighten skin tone, reduce pigmentation and improve skin texture.",
    keywords: "vakro serum, face serum, skin brightening serum, india best face serum, best serum",
    features: [
      { icon: <Sparkles size={18}/>, text: "Brightens skin tone" },
      { icon: <Droplets size={18}/>, text: "Deep hydration" },
      { icon: <ShieldCheck size={18}/>, text: "Skin barrier repair" },
      { icon: <Sun size={18}/>, text: "Reduces pigmentation" }
    ],
    benefits: [
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
    ],
    ingredients: [
      {
        name: "EXOSOMAL Azelaic Acid",
        description: ""
      },
      {
        name: "Niacinamide",
        description: "Reduces pigmentation and improves skin texture."
      },
      {
        name: "Salicylic Acid",
        description: ""
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
    ],
    usageSteps: [
      "Cleanse your face with a gentle facewash.",
      "Take 2-3 drops of serum.",
      "Apply evenly on face and neck.",
      "Gently pat until fully absorbed.",
      "Follow with moisturizer and sunscreen."
    ],
    heroImage: faceserum,
    howTOUseImage: faceserumusage,
    tagLine: "A lightweight serum formulated to brighten skin tone and restore natural glow.",
    homepageData: {
      description: "Multi-Active Acne Clarifying & Oil Balancing Serum.",
      category: "Face Care",
      image: faceserum,
      alt: "Vakro Lite Dual Hit Serum with Azelaic Acid and Salicylic Acid for acne control",
      productLink: "/products/vakro-lite-face-serum",
    }
  }
};