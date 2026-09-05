const router = require('express').Router();
const { list, getById } = require('../controllers/jobController');

router.get('/jobs', list);
router.get('/jobs/:id', getById);

module.exports = router;
