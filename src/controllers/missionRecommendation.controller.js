const {
  getRecommendedMissions,
} = require('../services/missionRecommendation.service');

exports.getRecommendedMissions = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const missions = await getRecommendedMissions(userId);

    res.json({
      message: 'Recommended missions',
      data: missions,
    });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'User not found' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to get recommended missions' });
  }
};
