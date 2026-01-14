// src/controllers/userSession.controller.js

const {
  startSessionService,
  logSessionService,
  getSessionLogsService,
} = require('../services/userSession.service');

async function startSessionHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const { userMissionSessionId } = req.body;

    const session = await startSessionService(userId, Number(userMissionSessionId));

    res.json({
      status: 'success',
      message: 'Session started',
      data: {
        id: session.id,
        status: session.status,
        scheduledDate: session.scheduledDate,
        targetDurationMin: session.missionSession?.targetDurationMin ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function logSessionHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const { userMissionSessionId } = req.params;
    const payload = req.body;

    const log = await logSessionService(
      userId,
      Number(userMissionSessionId),
      payload
    );

    res.json({
      status: 'success',
      message: 'Session completed',
      data: log,
    });
  } catch (err) {
    next(err);
  }
}

async function getSessionLogs(req, res, next) {
  try {
    const userId = req.user.id;
    const { from, to, limit } = req.query;

    const logs = await getSessionLogsService(userId, { from, to, limit });

    res.json({
      status: 'success',
      data: logs,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startSessionHandler,
  logSessionHandler,
  getSessionLogs,
};
