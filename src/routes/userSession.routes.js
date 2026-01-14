// src/routes/userSession.routes.js

const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/userSession.controller');

// START session (pakai userMissionSessionId dari mission aktif)
router.post('/start', auth, controller.startSessionHandler);

// FINISH / LOG session
router.post('/:userMissionSessionId/log', auth, controller.logSessionHandler);

// HISTORY semua session log user
router.get('/', auth, controller.getSessionLogs);

// optional: test
router.get('/test', (req, res) => {
  res.json({ message: 'user sessions route ok' });
});

module.exports = router;
