export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;

  if (error.name === "ValidationError") {
    res.status(400).json({ message: "Validation failed.", errors: Object.values(error.errors).map((item) => item.message) });
    return;
  }

  if (error.code === 11000) {
    res.status(409).json({ message: "Duplicate value.", fields: Object.keys(error.keyValue ?? {}) });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({ message: "Invalid identifier." });
    return;
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error." : error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  });
};
