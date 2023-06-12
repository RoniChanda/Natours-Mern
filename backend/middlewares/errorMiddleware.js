const AppError = require("../utils/appError");

// ******************************* Database Errors ************************************
// Cast Error
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

// Duplicate fields Error
const handleDuplicateFieldsDB = (error) => {
  const key = Object.keys(error.keyValue);
  const value = Object.values(error.keyValue);
  let message = "";

  if (key.includes("tour") && key.includes("user")) {
    message = "You have already reviewed this tour. Please update instead!";
  } else {
    message = `${value} already in use. Please use another ${key}!`;
  }
  return new AppError(message, 400);
};

// Validation Error
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}.`;
  return new AppError(message, 400);
};

// ******************************* jsonwebtoken Error ************************************
const handleJWTError = () =>
  new AppError("Invalid token. Please login again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again!", 401);

// ******************************* Development Error ************************************
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// ******************************* Production Error ************************************
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational Errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown errors
    console.error("Error:", err); // Log in hosting platform console

    res.status(500).json({
      status: "ERROR",
      message: "Something went very wrong!",
    });
  }
};

// ******************************* Global Error Handler ************************************
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
