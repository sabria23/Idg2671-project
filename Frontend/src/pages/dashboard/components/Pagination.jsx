import React from 'react';
import styles from '../styles/SimplePagination.module.css';

/**
 * Minimalist pagination component
 */
const MinimalPagination = ({ 
  currentPage, 
  totalPages,
  onPageChange
}) => {
  // Don't show pagination if there's only one page or no pages
  if (totalPages <= 1) return null;
  
  // Calculate if there are previous or next pages
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