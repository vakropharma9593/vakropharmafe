import { Shield, Leaf, Award, Heart } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Dermatologist Tested",
    description: "All our products are clinically tested and approved by certified dermatologists for safety and efficacy.",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "We use only natural botanical extracts and ingredients, free from harmful chemicals and parabens.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized by industry experts for excellence in skincare innovation and product quality.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "We never test on animals and are committed to ethical and sustainable beauty practices.",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="benefits-section">
      <div className="container">
        <div className="benefits-header animate-fade-in">
          <h2>
            Why Choose <span className="benefits-title-gradient">Vakro</span>
          </h2>
          <p className="benefits-description">
            We&apos;re committed to delivering the highest quality skincare products backed by science and nature
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="benefit-card shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="benefit-content">
                  <div className="benefit-icon-wrapper">
                    <Icon className="benefit-icon" />
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
