import facewash from "../../public/assets/facewash.jpeg";
import faceSerum from "../../public/assets/faceserum.jpeg";
import moisturizer from "../../public/assets/moisturiser.jpeg";
import sunscreen from "../../public/assets/sunscreen.jpeg";
import Image from "next/image";

const products = [
  {
    name: "Luxury Depigmenting Face Wash",
    description: "Experience the Art of Balanced Skin with Vakro Depigmenting Face Wash.",
    category: "Face Care",
    image: facewash,
    alt: "Vakro Glow Balance Depigmenting Face Wash with Salicylic Acid and Niacinamide",
  },
  {
    name: "Anti-Acne & Depigmenting Face Serum",
    description: "Multi-Active Acne Clarifying & Oil Balancing Serum.",
    category: "Face Care",
    image: faceSerum,
    alt: "Vakro Lite Dual Hit Serum with Azelaic Acid and Salicylic Acid for acne control",
  },
  {
    name: "Face Mositurizer Gel",
    description: "Experience advanced hydration with powerful sun defense in one lightweight formula.",
    category: "Face Care",
    image: moisturizer,
    alt: "Vakro Aqualite SPF 50+ Face Moisturizer Gel with 5 Ceramides",
  },
  {
    name: "Vakro Lite Anti-Pigment SPF 50+ Sunscreen",
    description: "Broad-spectrum SPF 50+ sunscreen that protects from UV damage and helps reduce dark spots for an even-toned glow.",
    category: "Sun Care",
    image: sunscreen,
    alt: "Vakro Lite Anti-Pigment SPF 50+ Broad Spectrum Sunscreen",
  },
];

const Products = () => {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="products-header animate-fade-in">
          {/* <span className="badge badge-default" style={{marginBottom: '1rem'}}>
            Our Collection
          </span> */}
          <h2>Our Skincare Range</h2>
          <p className="products-description">
            Discover our range of dermatologist-tested products crafted with natural ingredients for your beauty needs
          </p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="product-image-wrapper">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-overlay" />
                <span className="badge badge-default" style={{position: 'absolute', top: '1rem', left: '1rem'}}>
                  {product.category}
                </span>
              </div>
              <div className="product-content">
                <h3 className="product-name">
                  {product.name}
                </h3>
                <p className="product-description">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
