// src/routes/user-mission.routes.js

const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/user-mission.controller');

router.post('/', auth, controller.chooseMission);
router.get('/active', auth, controller.getActiveMission);
router.get('/active/sessions/today', auth, controller.getTodaySession);

module.exports = router;
