const multer = require('multer');
const { logger } = require('../utils/logger');

function notFound(_req, res) { res.status(404).json({ error: 'Route not found' }); }

function errorHandler(error, _req, res, _next) {
  logger.error({ err: error }, 'Request failed');
  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Video exceeds the configured size limit' : error.message;
    return res.status(400).json({ error: message });
  }
  return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
