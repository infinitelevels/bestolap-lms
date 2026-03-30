const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Server Error"
  });
};

export default errorMiddleware;
