// pages/dashboard/DashboardPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/Dash.module.css';
import FilterControls from './components/FilterControls';
import StudiesList from './components/StudiesList.jsx';
import { useStudies } from './hooks/useStudies.js';
import { useUrlParams } from './hooks/useUrlParams';
import { useUser } from './hooks/useUser.js'; // Assume this exists or create it
import WelcomeHeader from './components/WelcomeHeader';

/**
 * Main Dashboard Page - now with responsibilities split into smaller components and hooks
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const newStudyId = location.state?.newStudyId;

  console.log('Newly created study id:', newStudyId);
  
  // Use custom hooks to manage URL parameters and user data
  const { 
    currentPage, 
    limit, 
    sortBy, 
    sortOrder, 
    status, 
    handleFilterChange, 
    handlePageChange 
  } = useUrlParams();
  
  const { currentUser } = useUser();
  
  // Local state for errors and loading state that this component manages
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Use the studies hook to fetch and manage studies data
  const { 
    studies, 
    loading: studiesLoading, 
    error: studiesError, 
    pagination, 
    refreshStudies 
  } = useStudies({ 
    page: currentPage, 
    limit, 
    sortBy, 
    sortOrder, 
    status 
  });
  
  // Combine local and hook loading/error states
  const isLoading = loading || studiesLoading;
  const displayError = error || studiesError;
  
  // Combine pagination with page change handler
  const paginationWithHandler = pagination ? {
    ...pagination,
    handlePageChange
  } : null;
  
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Welcome header as a separate component */}
        <WelcomeHeader username={currentUser?.username} />

        {/* Filter controls */}
        <FilterControls
          status={status}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFilterChange={handleFilterChange}
        />

        {/* Loading indicator */}
        {isLoading && <div className={styles.loadingIndicator}>Loading studies...</div>}

        {/* Error message */}
        {displayError && (
          <div className={styles.errorMessage}>
            {displayError}
          </div>
        )}

        {/* Studies list - only show when not loading and no errors */}
        {!isLoading && !displayError && (
          <StudiesList 
            studies={studies}
            pagination={paginationWithHandler}
            refreshStudies={refreshStudies}
            setError={setError}
            setLoading={setLoading}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;