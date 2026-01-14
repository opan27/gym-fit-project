const {
  chooseMissionService,
  getActiveMissionService,
  getAllSessionsForActiveMissionService,
  getTodaySessionService,
} = require('../services/userMission.service');

exports.chooseMission = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { missionId } = req.body;

    const { userMission, mission } = await chooseMissionService(userId, missionId);

    res.status(201).json({
      message: 'Mission chosen & schedule generated',
      data: {
        mission: {
          id: mission.id,
          title: mission.title,
          durationDays: mission.durationDays,
          sessionsPerWeek: mission.sessionsPerWeek,
        },
        userMission: {
          id: userMission.id,
          startDate: userMission.startDate,
          endDate: userMission.endDate,
          status: userMission.status,
        },
      },
    });
  } catch (err) {
    if (err.message === 'ACTIVE_MISSION_EXISTS') {
      return res.status(400).json({ message: 'You already have an active mission' });
    }
    if (err.message === 'MISSION_NOT_FOUND') {
      return res.status(404).json({ message: 'Mission not found' });
    }
    if (err.message === 'MISSION_HAS_NO_SESSIONS') {
      return res.status(400).json({ message: 'Mission has no sessions template' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to choose mission' });
  }
};

exports.getActiveMission = async (req, res) => {
  try {
    const mission = await getActiveMissionService(Number(req.user.id));

    if (!mission) {
      return res.status(200).json({
        message: 'No active mission',
        data: null,
      });
    }

    res.json({
      message: 'Active mission',
      data: mission,
    });
  } catch (err) {
    console.error('GET ACTIVE MISSION ERROR:', err);
    res.status(500).json({ message: 'Failed to get active mission' });
  }
};

exports.getAllSessionsForActiveMission = async (req, res) => {
  try {
    const sessions = await getAllSessionsForActiveMissionService(Number(req.user.id));
    res.json({
      message: 'Sessions for active mission',
      data: sessions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get sessions' });
  }
};

exports.getTodaySession = async (req, res) => {
  try {
    const session = await getTodaySessionService(Number(req.user.id));
    res.json({
      message: 'Today session',
      data: session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get today session' });
  }
};
