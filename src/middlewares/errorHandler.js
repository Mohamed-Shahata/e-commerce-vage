const errorHandler = (err, req, res, next) => {
  console.log("errorHandler: ", err);

  const message = err.message || "Internal Server Error";
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message
  })
};

export default errorHandler;