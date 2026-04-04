import Link from "next/link";
import styles from "../styles/404.module.css";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.subtitle}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Go to Homepage
          </Link>

          <Link href="/products/facewash" className={styles.secondaryBtn}>
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  );
}