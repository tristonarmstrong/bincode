const errorHandler = (err, req, res, next) => {
    console.error({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    });
  
    if (err.type === 'validation') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message
      });
    }
  
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message
    });
  };
  
  module.exports = errorHandler;