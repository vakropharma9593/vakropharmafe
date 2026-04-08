import styles from "../styles/miniLoader.module.css";
import vakroLogo from "../../public/assets/darkGreenLogo.svg";
import Image from "next/image";

const MiniLoader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <div className={styles.drop}></div>

        {/* 🔥 Logo instead of V */}
        <div className={styles.logo}>
          <Image
            src={vakroLogo}
            alt="Vakro Pharma"
            width={20}
            height={20}
            priority
          />
        </div>

        <div className={styles.ripple}></div>
      </div>
    </div>
  );
};

export default MiniLoader;