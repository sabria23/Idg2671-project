import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import styles from '../../styles/Dash.module.css';
import FilterControls from './components/FilterControls';
import StudiesList from './components/StudiesList.jsx';
import { useStudies } from './hooks/useStudies.js';
import { useUrlParams } from './hooks/useUrlParams';
import { useUser } from './hooks/useUser.js'; 
import WelcomeHeader from './components/WelcomeHeader';

const DashboardPage = () => {
  const navigate = useNavigate();

  // using custom hooks to manage URL parameters and user data
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
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // using the studies hook to fetch and manage studies data
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
        <WelcomeHeader username={currentUser?.username} />

        <FilterControls
          status={status}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFilterChange={handleFilterChange}
        />

        {isLoading && <div className={styles.loadingIndicator}>Loading studies...</div>}

        {displayError && (
          <div className={styles.errorMessage}>
            {displayError}
          </div>
        )}

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