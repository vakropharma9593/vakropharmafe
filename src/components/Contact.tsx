import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import Loader from "./Loader";
import styles from "../styles/contact.module.css";

const Contact = () => {

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loader, setLoader] = useState<boolean>(false);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone) && phone?.length > 0) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) && email?.length > 0) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "" &&
    !errors.phone &&
    !errors.email;

  const handleSubmit = async (e: React.FormEvent) => {
    setLoader(true);
    e.preventDefault();

    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast("Message Sent! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        type: "success",
        transition: Bounce,
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

    } catch {
      toast("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        type: "error",
        theme: "light",
        transition: Bounce,
      });

    } finally {
      setLoader(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h2 className={styles.title}>Get In Touch</h2>
          <p className={styles.description}>
            Have questions about our products? We&apos;d love to hear from you.
          </p>
        </div>

        <div className={styles.grid}>

          {/* Contact Info */}

          <div className={styles.contactInfo}>

            <h3 className={styles.infoTitle}>Contact Information</h3>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Mail size={20}/>
              </div>
              <div className={styles.contactItemRight}>
                <div className={styles.label}>Email Us</div>
                <a href="mailto:info@vakropharma.com" className={styles.value}>
                  info@vakropharma.com
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Phone size={20}/>
              </div>
              <div className={styles.contactItemRight}>
                <div className={styles.label}>Call Us</div>
                <a href="tel:+919079811724" className={styles.value}>
                  +91 9079811724
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <MapPin size={20}/>
              </div>
              <div className={styles.contactItemRight} >
                <div className={styles.label}>Visit Us</div>
                <div className={styles.value}>
                  Piragi, Raipur Berisal, Bijnor, Uttar Pradesh, 246721
                </div>
              </div>
            </div>

          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className={styles.contactForm}>

            <input
              className={styles.input}
              placeholder="Your Name"
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              required
            />

            <div>
              <input
                type="tel"
                className={styles.input}
                placeholder="Your Contact Number"
                value={formData.phone}
                maxLength={10}
                onChange={(e)=>{
                  const value=e.target.value.replace(/\D/g,"");
                  setFormData({...formData,phone:value});
                }}
                onBlur={()=> validatePhone(formData.phone)}
                required
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
            </div>

            <div>
              <input
                type="email"
                className={styles.input}
                placeholder="Your Email"
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                onBlur={()=>validateEmail(formData.email)}
                required
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <textarea
              className={styles.textarea}
              placeholder="Your Message"
              value={formData.message}
              rows={5}
              onChange={(e)=>setFormData({...formData,message:e.target.value})}
              required
            />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFormValid}
            >
              Send Message
            </button>

          </form>

        </div>
      </div>

      {loader && <Loader />}
    </section>
  );
};

export default Contact;