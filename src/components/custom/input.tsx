"use client";

import styles from "../../styles/custom/customInput.module.css";

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  prefix?: string; // ₹ support
};

const PremiumInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  prefix,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label} {required && <span>*</span>}
      </label>

      <div className={`${styles.inputContainer} ${error ? styles.errorBorder : ""}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default PremiumInput;