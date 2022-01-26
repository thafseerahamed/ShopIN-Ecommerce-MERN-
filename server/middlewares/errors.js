const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    //    Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid :${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation ErrorHandler
    if (err.name === "validationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }
    // Handling Mongoose duplicate key errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }
    // Handling wrong JWT error
    if (err.name === "jsonWebTokenError") {
      const message = "JSON Web Token is Invalid.Try Again !!!";
      error = new ErrorHandler(message, 400);
    }
    // Handling Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
