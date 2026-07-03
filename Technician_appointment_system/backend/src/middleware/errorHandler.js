function notFoundHandler(req, res, _next) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err && err.code && String(err.code).startsWith('SQLITE_CONSTRAINT')) {
    return res.status(400).json({
      success: false,
      message: 'Database constraint violation. Please check the submitted values.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
}

module.exports = { notFoundHandler, errorHandler };
