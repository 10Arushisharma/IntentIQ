const fs = require('fs/promises');
const path = require('path');
const { logger } = require('./logger');

async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true });
}

async function removeFile(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
    logger.info({ filePath }, 'Temporary upload removed');
  } catch (error) {
    if (error.code !== 'ENOENT') logger.warn({ err: error, filePath }, 'Unable to remove temporary upload');
  }
}

function uploadDirectory() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
}

module.exports = { ensureDirectory, removeFile, uploadDirectory };
