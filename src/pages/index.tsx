import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div style={{minHeight: '100vh'}}>
      <Navbar />
      <Hero />
      <Products />
      <Benefits />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
