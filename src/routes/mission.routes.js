// src/routes/mission.routes.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const missionController = require('../controllers/mission.controller');

// GET /api/missions/recommended
router.get(
  '/recommended',
  auth,
  missionController.getRecommendedMissionsHandler
);

// BARU: GET /api/missions/:missionId/detail  → lihat summary TANPA assign
router.get(
  '/:missionId/detail',
  auth,
  missionController.getMissionDetailHandler
);

// Lama: POST /api/missions/:missionId/assign → klik "Start mission" / "Assign"
router.post(
  '/:missionId/assign',
  auth,
  missionController.assignMissionHandler
);

module.exports = router;
