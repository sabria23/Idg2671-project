import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook to manage URL search parameters for filtering and pagination
 */
export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const getParam = (param, defaultValue) => {
    return searchParams.get(param) || defaultValue;
  };
  
  const currentPage = parseInt(getParam('page', '1'), 10);
  const limit = parseInt(getParam('limit', '10'), 10);
  const sortBy = getParam('sortBy', 'createdAt');
  const sortOrder = getParam('sortOrder', 'desc');
  const status = getParam('status', 'all');
  
  // function to handle filter changes
  const handleFilterChange = (filterType, value) => {
    // Reset to page 1 when filters change
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.set(filterType, value);
    setSearchParams(newParams);
  };
  
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };
  
  const resetFilters = () => {
    setSearchParams({
      page: '1',
      limit: '10',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      status: 'all'
    });
  };
  
  return {
    currentPage,
    limit,
    sortBy,
    sortOrder,
    status,
    handleFilterChange,
    handlePageChange,
    resetFilters
  };
}