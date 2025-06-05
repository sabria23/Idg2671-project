import React from 'react';
import styles from '../styles/SimplePagination.module.css';

const MinimalPagination = ({ 
  currentPage, 
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  
  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pageButton} ${!hasPrevPage ? styles.disabled : ''}`}
        onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        aria-label="Previous page"
      >
        ←
      </button>
      
      <span className={styles.pageIndicator}>
        {currentPage} / {totalPages}
      </span>
      
      <button
        className={`${styles.pageButton} ${!hasNextPage ? styles.disabled : ''}`}
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );
};

export default MinimalPagination;