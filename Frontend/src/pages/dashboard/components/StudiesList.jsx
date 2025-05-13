import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudyItem from './StudyItem';
import ConfirmationMsg from '../../../components/common/ConfirmationMsg';
import { useState } from 'react';
import { handleDelete } from '../utils/studyActions.js';
import SimplePagination from '../components/Pagination.jsx';
import styles from '../../../styles/Dash.module.css';

/**
 * Presentation component for rendering the list of studies
 */
const StudiesList = ({ 
  studies, 
  pagination, 
  refreshStudies,
  setError,
  setLoading
}) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState(null);
  
  // Handle study action
  const handleExport = (studyId) => {
    navigate(`/export-results/${studyId}`);
  };
  
  const handleEdit = (studyId) => {
    navigate(`/study/${studyId}`);
  };

  const initiateDelete = (studyId) => {
    setStudyToDelete(studyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studyToDelete) {
      try {
        setLoading(true);
        await handleDelete(studyToDelete);
        // Refresh the studies list after deletion
        await refreshStudies();
      } catch (error) {
        setError('Failed to delete study. Please try again.');
      } finally {
        setLoading(false);
        setIsDeleteModalOpen(false);
        setStudyToDelete(null);
      }
    }
  };
  
  // If there are no studies, show empty state
  if (studies.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyState}>
          <h3>Organize all your studies with projects</h3>
          <button
            data-testid="create-first-project-button"
            className={styles.createFirstButton}
            onClick={() => navigate('/create-study')}
          >
            Create your first project
          </button>
        </div>
      </div>
    );
  }
  
  // Otherwise, show the list of studies
  return (
    <>
      <div className={styles.studyList}>
        {studies.map(study => (
          <StudyItem
            key={study._id}
            study={study}
            onEdit={handleEdit}
            onDelete={initiateDelete}
            onExport={handleExport}
          />
        ))}
      </div>
      
      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <SimplePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.handlePageChange}
        />
      )}
      
      <ConfirmationMsg
        isOpen={isDeleteModalOpen}
        message="Are you sure you want to delete this study? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default StudiesList;