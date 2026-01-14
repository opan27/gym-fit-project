const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getMeController,
  updateMyProfileController,
} = require('../controllers/me.controller');
const meStatsController = require('../controllers/meStats.controller'); // ← TAMBAH INI

router.get('/', auth, getMeController);
router.put('/profile', auth, updateMyProfileController);

// stats
router.get('/stats', auth, meStatsController.getMyStatsHandler);

module.exports = router;
