// src/services/userSession.service.js
const prisma = require('../db/prisma');

async function startSessionService(userId, userMissionSessionId) {
  const session = await prisma.userMissionSession.findUnique({
    where: { id: userMissionSessionId },
    include: {
      userMission: true,
      missionSession: true,
    },
  });

  if (!session || session.userMission.userId !== userId) {
    throw new Error('SESSION_NOT_FOUND');
  }

  const updated = await prisma.userMissionSession.update({
    where: { id: userMissionSessionId },
    data: {
      status: 'in_progress',
      // startedAt: new Date(), // kalau mau
    },
    include: {
      missionSession: true,
    },
  });

  return updated;
}

async function logSessionService(userId, userMissionSessionId, payload) {
  const session = await prisma.userMissionSession.findUnique({
    where: { id: userMissionSessionId },
    include: {
      userMission: true,
      missionSession: true,
    },
  });

  if (!session || session.userMission.userId !== userId) {
    throw new Error('SESSION_NOT_FOUND');
  }

  const {
    actualDurationMinutes,
    perceivedIntensity,
    caloriesEstimated,
    moodBefore,
    moodAfter,
    note,
    proofPhotoUrl,
    exercises = [],
  } = payload;

  // map intensity string -> int
  let perceivedIntensityValue = null;
  if (typeof perceivedIntensity === 'string') {
    const intensityMap = { low: 1, medium: 2, high: 3 };
    perceivedIntensityValue = intensityMap[perceivedIntensity] ?? null;
  } else {
    perceivedIntensityValue = perceivedIntensity;
  }

  // map mood string -> int
  const moodMap = {
    very_bad: 1,
    bad: 2,
    neutral: 3,
    good: 4,
    very_good: 5,
  };

  let moodBeforeValue = null;
  if (typeof moodBefore === 'string') {
    moodBeforeValue = moodMap[moodBefore] ?? null;
  } else {
    moodBeforeValue = moodBefore;
  }

  let moodAfterValue = null;
  if (typeof moodAfter === 'string') {
    moodAfterValue = moodMap[moodAfter] ?? null;
  } else {
    moodAfterValue = moodAfter;
  }

  const { targetDurationMin } = session.missionSession || {};
  const isCompleted =
    actualDurationMinutes != null &&
    targetDurationMin != null &&
    actualDurationMinutes >= targetDurationMin;

  const log = await prisma.userSessionLog.create({
    data: {
      userMissionSessionId,
      userId,
      actualDurationMinutes,
      perceivedIntensity: perceivedIntensityValue,
      caloriesEstimated,
      moodBefore: moodBeforeValue,
      moodAfter: moodAfterValue,
      note,
      proofPhotoUrl,
      exerciseLogs: {
        create: exercises.map((e) => ({
          exerciseId: e.exerciseId,
          setNumber: e.setNumber,
          reps: e.reps,
          weight: e.weight ?? null,
        })),
      },
    },
    include: {
      exerciseLogs: true,
    },
  });

  await prisma.userMissionSession.update({
    where: { id: userMissionSessionId },
    data: {
      status: isCompleted ? 'completed' : 'in_progress',
    },
  });

  return log;
}

/**
 * Ambil history log session user (UserSessionLog)
 */
async function getSessionLogsService(userId, options = {}) {
  const { from, to, limit = 50 } = options;

  const where = { userId };

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const logs = await prisma.userSessionLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    include: {
      exerciseLogs: true,
      userMissionSession: {
        include: {
          missionSession: true,
          userMission: {
            include: {
              mission: true,
            },
          },
        },
      },
    },
  });

  return logs;
}

module.exports = {
  startSessionService,
  logSessionService,
  getSessionLogsService,
};
