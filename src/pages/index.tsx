import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ToastContainer, Bounce } from 'react-toastify';
import SEO from "@/components/SEO";
// import Dermatologist from "@/components/Dermatologist";

const Index = () => {
  return (
    <>
      <SEO
        title="Vakro Pharma | Dermatologist Developed Skincare"
        description="Vakro Pharma offers dermatologist-formulated skincare including facewash, sunscreen, face serum and moisturizer designed for Indian skin."
        keywords="dermatologist skincare India, facewash for oily skin, sunscreen gel India, vitamin c serum India, facewash, best facewash, best sunscreen, daily use moisturiser"
        url="https://www.vakropharma.com"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Vakro Pharma",
            "url": "https://www.vakropharma.com",
            "logo": "https://www.vakropharma.com/assets/vakroGreenLogo.png",
            "description": "Dermatologist developed skincare brand focused on acne, pigmentation and sun protection.",
            "founder": {
              "@type": "Person",
              "name": "Mr. Munnu Singh"
            },
            // "sameAs":[
            //   "https://www.instagram.com/vakropharma",
            //   "https://www.linkedin.com/company/vakropharma"
            // ]
          })
        }}
      />

      <main style={{minHeight: '100vh'}}>
        <Navbar />
        <Hero />
        <Products />
        <Benefits />
        {/* <Dermatologist /> */}
        <Contact />
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

      </main>
    </>
  );
};

export default Index;
