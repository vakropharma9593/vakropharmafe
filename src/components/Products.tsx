import facewash from "../../public/assets/product-facewash.jpg";
import faceSerum from "../../public/assets/product-face-serum.jpg";
import hairSerum from "../../public/assets/product-hair-serum.jpg";
import shampoo from "../../public/assets/product-shampoo.jpg";
import cleanser from "../../public/assets/product-cleanser.jpg";
import moisturizer from "../../public/assets/product-moisturizer.jpg";
import eyeCream from "../../public/assets/product-eye-cream.jpg";
import sunscreen from "../../public/assets/product-sunscreen.jpg";
import bodyLotion from "../../public/assets/product-body-lotion.jpg";
import lipBalm from "../../public/assets/product-lip-balm.jpg";
import Image from "next/image";

const products = [
  {
    name: "Gentle Face Wash",
    description: "Deep cleansing formula with botanical extracts",
    category: "Face Care",
    image: facewash,
  },
  {
    name: "Radiance Face Serum",
    description: "Intensive hydration with vitamin C boost",
    category: "Face Care",
    image: faceSerum,
  },
  {
    name: "Hair Growth Serum",
    description: "Strengthening formula for healthy hair",
    category: "Hair Care",
    image: hairSerum,
  },
  {
    name: "Nourishing Shampoo",
    description: "Natural ingredients for silky smooth hair",
    category: "Hair Care",
    image: shampoo,
  },
  {
    name: "Daily Face Cleanser",
    description: "Gentle cleansing for sensitive skin",
    category: "Face Care",
    image: cleanser,
  },
  {
    name: "Hydrating Moisturizer",
    description: "24-hour moisture lock technology",
    category: "Face Care",
    image: moisturizer,
  },
  {
    name: "Anti-Aging Eye Cream",
    description: "Reduces fine lines and dark circles",
    category: "Face Care",
    image: eyeCream,
  },
  {
    name: "SPF 50 Sunscreen",
    description: "Broad spectrum UV protection",
    category: "Sun Care",
    image: sunscreen,
  },
  {
    name: "Body Lotion",
    description: "All-day hydration for soft skin",
    category: "Body Care",
    image: bodyLotion,
  },
  {
    name: "Nourishing Lip Balm",
    description: "Natural oils for smooth, healthy lips",
    category: "Lip Care",
    image: lipBalm,
  },
];

const Products = () => {
  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="products-header animate-fade-in">
          <span className="badge badge-default" style={{marginBottom: '1rem'}}>
            Our Collection
          </span>
          <h2>Premium Products</h2>
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
