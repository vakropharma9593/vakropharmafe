import styles from "../styles/loader.module.css";

const Loader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.drop}></div>
        <div className={styles.vLogo}>V</div>
        <div className={styles.ripple}></div>
      </div>

      <p className={styles.text}>Vakro Pharma</p>
    </div>
  );
};

export default Loader;