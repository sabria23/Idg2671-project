export const handleApiError = (error, setErrorFunction, customMessage = null) => {
    console.error('API Error:', error);
    
    // this si a custom message to use when needed
    if (customMessage) {
      setErrorFunction(customMessage);
      return;
    }
    
    // Otherwise, determine message based on error type
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        setErrorFunction('Your session has expired. Please login again.');
      } else if (error.response.status === 404) {
        setErrorFunction('The requested resource was not found.');
      } else {
        setErrorFunction(`Error: ${error.response.data.message || 'Something went wrong'}`);
      }
    } else if (error.request) {
      // No response received
      setErrorFunction('Network error. Please check your connection.');
    } else {
      // Other errors
      setErrorFunction('An unexpected error occurred.');
    }
  };