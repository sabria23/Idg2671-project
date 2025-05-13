import React from 'react';
import styles from '../styles/FilterControls.module.css';

/**
 * Simplified FilterControls component for filtering and sorting studies
 */
const FilterControls = ({ status, sortBy, sortOrder, onFilterChange }) => {
  return (
    <div className={styles.filterContainer}>
      {/* Status filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          className={styles.filterSelect}
          value={status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">All Studies</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Sort field selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="sort-by">Sort by:</label>
        <select
          id="sort-by"
          className={styles.filterSelect}
          value={sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <option value="createdAt">Creation Date</option>
          <option value="title">Title</option>
          <option value="updatedAt">Last Updated</option>
        </select>
      </div>

      {/* Simplified sort order selector - just ascending/descending */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="sort-order">Order:</label>
        <select
          id="sort-order"
          className={styles.filterSelect}
          value={sortOrder}
          onChange={(e) => onFilterChange('sortOrder', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Clear filters button */}
      <div className={styles.filterGroup}>
        <button
          className={styles.clearButton}
          onClick={() => {
            onFilterChange('status', 'all');
            onFilterChange('sortBy', 'createdAt');
            onFilterChange('sortOrder', 'desc');
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterControls;