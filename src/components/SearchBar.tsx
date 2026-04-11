import styles from "../styles/searchBar.module.css";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder }: Props) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={value}
        placeholder={placeholder || "Search..."}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;