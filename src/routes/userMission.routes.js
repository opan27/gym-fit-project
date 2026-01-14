const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/userMission.controller');
const progressController = require('../controllers/userMissionProgress.controller');

router.post('/', auth, controller.chooseMission);
router.get('/active', auth, controller.getActiveMission);
router.get('/active/sessions', auth, controller.getAllSessionsForActiveMission);
router.get('/active/sessions/today', auth, controller.getTodaySession);
router.get('/active/progress', auth, progressController.getActiveMissionProgress);

module.exports = router;
