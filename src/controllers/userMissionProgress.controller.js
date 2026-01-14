const {
  getActiveMissionProgress,
} = require('../services/userMissionProgress.service');

exports.getActiveMissionProgress = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const progress = await getActiveMissionProgress(userId);

    if (!progress) {
      return res.status(200).json({
        message: 'No active mission',
        data: null,
      });
    }

    res.json({
      message: 'Active mission progress',
      data: progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get mission progress' });
  }
};
