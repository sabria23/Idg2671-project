import { useState, useEffect } from 'react';
import { getAllStudies } from '../../../services/studyService';
import { handleApiError } from '../../../utils/errorHandler';

/**
 * Custom hook to fetch and manage studies with pagination and filtering
 */
export function useStudies({ page, limit, sortBy, sortOrder, status }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studiesData, setStudiesData] = useState({
    data: [],
    pagination: {
      totalStudies: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10
    }
  });

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setLoading(true);
        
        const statusFilter = status !== 'all' ? status : null;
        
        const data = await getAllStudies({
          page,
          limit,
          sortBy,
          sortOrder,
          status: statusFilter
        });
    
        if (!data.pagination) {
          const studies = Array.isArray(data) ? data : data.data || [];
          setStudiesData({
            data: studies,
            pagination: {
              totalStudies: studies.length,
              totalPages: 1,
              currentPage: 1,
              limit: 10
            }
          });
        } else {
          setStudiesData(data);
        }
        
        setError(null);
      } catch (error) {
        handleApiError(error, setError, 'Could not load studies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudies();
  }, [page, limit, sortBy, sortOrder, status]);


  return {
    studies: Array.isArray(studiesData.data) ? studiesData.data : [],
    loading,
    error,
    pagination: studiesData.pagination,
    refreshStudies: async () => {
      setLoading(true);
      try {
        const statusFilter = status !== 'all' ? status : null;
        const data = await getAllStudies({
          page,
          limit,
          sortBy,
          sortOrder,
          status: statusFilter
        });
        setStudiesData(data);
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        setLoading(false);
      }
    }
  };
}