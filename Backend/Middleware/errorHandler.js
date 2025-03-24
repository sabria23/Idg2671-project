//reusing this from my oblig 2 full-stakc course, need to reference
const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    // Get status code from error or default to 500
    const statusCode = err.statusCode || 500;
    
    // Send error response
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Server Error'
    });
  };
  
  export default errorHandler;