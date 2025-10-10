// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("Error 💥:", err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Internal Server Error. Please try again later.";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      // In production, avoid sending stack trace
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
   