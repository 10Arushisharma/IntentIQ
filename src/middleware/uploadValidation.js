const multer = require('multer');
const path = require('path');
const { ensureDirectory, uploadDirectory } = require('../utils/fileUtils');

const allowedMimeTypes = new Set(['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']);
const allowedExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm']);
const uploadPath = uploadDirectory();
ensureDirectory(uploadPath).catch((error) => { throw error; });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadPath),
  filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 100) * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) return callback(null, true);
    const error = new Error('Unsupported video format');
    error.statusCode = 415;
    return callback(error);
  }
});

module.exports = { upload };
