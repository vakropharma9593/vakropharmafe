import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
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

            <form onSubmit={handleSubmit} className="contact-form animate-fade-in delay-200">
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
                  type="email"
                  className="input input-lg"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
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
              <button type="submit" className="btn btn-lg btn-gradient-primary" style={{width: '100%'}}>
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
