import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast, Bounce } from 'react-toastify';

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

  const validatePhone = (phone: string) => {
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone)) {
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

  if (!emailRegex.test(email)) {
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
  e.preventDefault();


  try {
    const response = await fetch("http://docter-api-service-lb-413222422.ap-south-1.elb.amazonaws.com/v1/contactus", {
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
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: "error",
      theme: "light",
      transition: Bounce,
    });
  }
};

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-container">
          <div className="contact-header animate-fade-in">
            <h2>Get In Touch</h2>
            <p className="contact-description">
              Have questions about our products? We&apos;d love to hear from you
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info animate-fade-in">
              <div>
                <h3>Contact Information</h3>
                <div className="contact-items">
                  <div className="contact-item">
                    <div className="contact-icon-wrapper primary">
                      <Mail className="contact-icon" />
                    </div>
                    <div className="contact-item-content">
                      <div className="contact-item-label">Email Us</div>
                      <div className="contact-item-value">info@vakropharma.com</div>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-wrapper secondary">
                      <Phone className="contact-icon" />
                    </div>
                    <div className="contact-item-content">
                      <div className="contact-item-label">Call Us</div>
                      <div className="contact-item-value">+91 9079811724</div>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-wrapper accent">
                      <MapPin className="contact-icon" />
                    </div>
                    <div className="contact-item-content">
                      <div className="contact-item-label">Visit Us</div>
                      <div className="contact-item-value">
                        Piragi, Raipur Berisal, Bijnor, Uttar Pradesh, 246721
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="contact-form animate-fade-in delay-200"
            >
              <div>
                <input
                  className="input input-lg"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                  <input
                    type="tel"
                    className="input input-lg"
                    placeholder="Your Contact Number"
                    value={formData.phone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: value });
                    }}
                    onBlur={() => validatePhone(formData.phone)}
                    required
                  />
                  {errors.phone && (
                    <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>
                  )}
              </div>

              <div>
                <input
                  type="email"
                  className="input input-lg"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={() => validateEmail(formData.email)}
                  required
                />

                {errors.email && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>
                )}
              </div>

              <div>
                <textarea
                  className="textarea"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-gradient-primary"
                style={{ width: "100%" }}
                disabled={!isFormValid}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;