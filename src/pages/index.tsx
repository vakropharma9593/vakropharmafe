import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ToastContainer, Bounce } from 'react-toastify';
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO
        title="Dermatologist Skincare Products in India | Vakro Pharma"
        description="Vakro Pharma offers dermatologist-formulated skincare including facewash, sunscreen, face serum and moisturizer designed for Indian skin."
        keywords="dermatologist skincare India, facewash for oily skin, sunscreen gel India, vitamin c serum India, facewash, best facewash, best sunscreen, daily use moisturiser"
        url="https://www.vakropharma.com"
      />
      <main style={{minHeight: '100vh'}}>
        <Navbar />
        <Hero />
        <Products />
        <Benefits />
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
