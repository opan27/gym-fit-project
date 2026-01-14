// src/controllers/meStats.controller.js

const { getUserStatsService } = require('../services/userStats.service');

async function getMyStatsHandler(req, res, next) {
  try {
    const userId = req.user.id;

    const stats = await getUserStatsService(userId);

    res.json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyStatsHandler,
};
