// server/src/middleware/logger.js - Custom logging middleware

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const safeBody = { ...req.body };
    // Remove sensitive fields if any
    delete safeBody.password;
    console.log('Request Body:', JSON.stringify(safeBody));
  }

  next();
};

module.exports = logger;