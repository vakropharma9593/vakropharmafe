import styles from "../styles/productSkeleton.module.css";

const ProductSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}></div>

      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.rating}></div>
        <div className={styles.price}></div>

        <div className={styles.lines}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={styles.button}></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;