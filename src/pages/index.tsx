import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ToastContainer, Bounce } from 'react-toastify';

const Index = () => {
  return (
      <div style={{minHeight: '100vh'}}>
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

      </div>
  );
};

export default Index;
