const {
  getRecommendedMissionsForUser,
} = require('../services/missionRecommendation.service');
const {
  getMissionDetailService,
  assignMissionAndGetDetail,
} = require('../services/mission.service');

// GET /api/missions/recommended (sudah ada)
async function getRecommendedMissionsHandler(req, res) {
  try {
    const userId = req.user.id;
    const result = await getRecommendedMissionsForUser(userId);
    return res.json({ status: 'success', data: result });
  } catch (err) {
    console.error('getRecommendedMissionsHandler error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// BARU: GET /api/missions/:missionId/detail  (summary tanpa assign)
async function getMissionDetailHandler(req, res) {
  try {
    const missionId = Number(req.params.missionId);
    const mission = await getMissionDetailService(missionId);

    return res.json({
      status: 'success',
      data: mission, // HANYA mission summary
    });
  } catch (err) {
    console.error('getMissionDetailHandler error:', err);
    if (err.code === 'MISSION_NOT_FOUND') {
      return res.status(404).json({ message: 'Mission tidak ditemukan' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// (opsional) tetap simpan assign mission kalau masih dipakai
async function assignMissionHandler(req, res) {
  try {
    const userId = req.user.id;
    const missionId = Number(req.params.missionId);
    const result = await assignMissionAndGetDetail(userId, missionId);
    return res.json({ status: 'success', data: result });
  } catch (err) {
    console.error('assignMissionHandler error:', err);
    if (err.code === 'MISSION_NOT_FOUND') {
      return res.status(404).json({ message: 'Mission tidak ditemukan' });
    }
    if (err.message === 'ACTIVE_MISSION_EXISTS') {
      return res.status(400).json({ message: 'User sudah punya active mission' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getRecommendedMissionsHandler,
  getMissionDetailHandler,
  assignMissionHandler,
};
