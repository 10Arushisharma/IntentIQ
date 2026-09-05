const router = require('express').Router();
const { upload } = require('../middleware/uploadValidation');
const { uploadVideo } = require('../controllers/uploadController');

router.post('/upload', upload.single('video'), uploadVideo);

module.exports = router;
