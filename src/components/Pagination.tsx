import styles from "../styles/pagination.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {

  // 🔥 Smart page range (instead of showing 1000 buttons)
  const getVisiblePages = () => {
    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      
      {/* FIRST */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>

      {/* PREV */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </button>

      {/* LEFT DOT */}
      {currentPage > 3 && <span className={styles.dots}>...</span>}

      {/* PAGE NUMBERS */}
      {getVisiblePages().map((page) => (
        <button
          key={page}
          className={page === currentPage ? styles.active : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* RIGHT DOT */}
      {currentPage < totalPages - 2 && (
        <span className={styles.dots}>...</span>
      )}

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </button>

      {/* LAST */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;