import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/FilterControls.module.css';

/**
 * Compact FilterControls component for filtering and sorting studies
 */
const FilterControls = ({ status, sortBy, sortOrder, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visibleFilters, setVisibleFilters] = useState({
    status: true,   // Status filter is visible by default
    sort: true      // Sort filter is visible by default
  });
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  
  // Add a filter to visible filters
  const addFilter = (filterType) => {
    setVisibleFilters({...visibleFilters, [filterType]: true});
    setActiveDropdown(filterType);
  };
  
  // Remove a filter from visible filters
  const removeFilter = (filterType) => {
    // Reset the filter to its default value
    if (filterType === 'status') {
      onFilterChange('status', 'all');
    } else if (filterType === 'sort') {
      onFilterChange('sortBy', 'createdAt');
      onFilterChange('sortOrder', 'desc');
    }
    
    // Hide the filter
    const newVisibleFilters = {...visibleFilters};
    newVisibleFilters[filterType] = false;
    setVisibleFilters(newVisibleFilters);
  };
  
  // Get display text for current status
  const getStatusText = () => {
    switch(status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      default: return 'All Studies';
    }
  };
  
  // Get display text for current sort
  const getSortText = () => {
    const direction = sortOrder === 'desc' ? '↓' : '↑';
    switch(sortBy) {
      case 'title': return `Title ${direction}`;
      case 'updatedAt': return `Last Updated ${direction}`;
      default: return `Creation Date ${direction}`;
    }
  };
  
  // Reset all filters to default values
  const resetAllFilters = () => {
    onFilterChange('status', 'all');
    onFilterChange('sortBy', 'createdAt');
    onFilterChange('sortOrder', 'desc');
    setActiveDropdown(null);
  };
  
  return (
    <div className={styles.filterBar} ref={dropdownRef}>
      {/* Filter controls on the left */}
      <div className={styles.filterGroup}>
        {/* Status filter */}
        {visibleFilters.status && (
          <div className={styles.filterItem}>
            <button 
              className={`${styles.filterButton} ${status !== 'all' ? styles.activeFilter : ''}`}
              onClick={() => toggleDropdown('status')}
            >
              {getStatusText()}
              <svg className={styles.chevronIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              {/* Remove filter button */}
              <button 
                className={styles.removeFilter}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter('status');
                }}
                aria-label="Remove filter"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </button>
            
            {activeDropdown === 'status' && (
              <div className={styles.dropdown}>
                <button 
                  className={`${styles.dropdownItem} ${status === 'all' ? styles.activeItem : ''}`}
                  onClick={() => {
                    onFilterChange('status', 'all');
                    setActiveDropdown(null);
                  }}
                >
                  All Studies
                </button>
                <button 
                  className={`${styles.dropdownItem} ${status === 'published' ? styles.activeItem : ''}`}
                  onClick={() => {
                    onFilterChange('status', 'published');
                    setActiveDropdown(null);
                  }}
                >
                  Published
                </button>
                <button 
                  className={`${styles.dropdownItem} ${status === 'draft' ? styles.activeItem : ''}`}
                  onClick={() => {
                    onFilterChange('status', 'draft');
                    setActiveDropdown(null);
                  }}
                >
                  Draft
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Sort filter */}
        {visibleFilters.sort && (
          <div className={styles.filterItem}>
            <button 
              className={styles.filterButton}
              onClick={() => toggleDropdown('sort')}
            >
              {getSortText()}
              <svg className={styles.chevronIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              {/* Remove filter button */}
              <button 
                className={styles.removeFilter}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter('sort');
                }}
                aria-label="Remove filter"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </button>
            
            {activeDropdown === 'sort' && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownSection}>
                  <div className={styles.dropdownLabel}>Sort by</div>
                  <button 
                    className={`${styles.dropdownItem} ${sortBy === 'createdAt' ? styles.activeItem : ''}`}
                    onClick={() => onFilterChange('sortBy', 'createdAt')}
                  >
                    Creation Date
                  </button>
                  <button 
                    className={`${styles.dropdownItem} ${sortBy === 'title' ? styles.activeItem : ''}`}
                    onClick={() => onFilterChange('sortBy', 'title')}
                  >
                    Title
                  </button>
                  <button 
                    className={`${styles.dropdownItem} ${sortBy === 'updatedAt' ? styles.activeItem : ''}`}
                    onClick={() => onFilterChange('sortBy', 'updatedAt')}
                  >
                    Last Updated
                  </button>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <div className={styles.dropdownSection}>
                  <div className={styles.dropdownLabel}>Direction</div>
                  <button 
                    className={`${styles.dropdownItem} ${sortOrder === 'desc' ? styles.activeItem : ''}`}
                    onClick={() => {
                      onFilterChange('sortOrder', 'desc');
                      setActiveDropdown(null);
                    }}
                  >
                    Descending ↓
                  </button>
                  <button 
                    className={`${styles.dropdownItem} ${sortOrder === 'asc' ? styles.activeItem : ''}`}
                    onClick={() => {
                      onFilterChange('sortOrder', 'asc');
                      setActiveDropdown(null);
                    }}
                  >
                    Ascending ↑
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add filter button on the right */}
      <div className={styles.filterItem}>
        <button
          className={styles.addFilterButton}
          onClick={() => toggleDropdown('addFilter')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add filter
        </button>
        
        {activeDropdown === 'addFilter' && (
          <div className={`${styles.dropdown} ${styles.addFilterDropdown}`}>
            {!visibleFilters.status && (
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  addFilter('status');
                  setActiveDropdown('status');
                }}
              >
                Status
              </button>
            )}
            
            {!visibleFilters.sort && (
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  addFilter('sort');
                  setActiveDropdown('sort');
                }}
              >
                Sort
              </button>
            )}
            
            {/* Only show divider if we have both options AND reset button */}
            {(!visibleFilters.status || !visibleFilters.sort) && (
              <div className={styles.dropdownDivider}></div>
            )}
            
           
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
      
 