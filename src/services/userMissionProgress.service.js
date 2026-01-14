const prisma = require('../db/prisma');

// hitung streak dari semua sesi completed user
async function getStreakDays(userId) {
  const sessions = await prisma.userMissionSession.findMany({
    where: {
      userMission: { userId },
      status: 'completed',
    },
    select: { scheduledDate: true },
  });

  if (sessions.length === 0) return 0;

  const daysSet = new Set(
    sessions.map((s) => s.scheduledDate.toISOString().slice(0, 10)) // "YYYY-MM-DD"
  );

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daysSet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// progress untuk mission aktif
async function getActiveMissionProgress(userId) {
  const active = await prisma.userMission.findFirst({
    where: { userId, status: 'active' },
    include: {
      mission: true,
      userSessions: true, // relasi: UserMission.userSessions -> UserMissionSession[]
    },
  });

  if (!active) return null;

  const totalSessions = active.userSessions.length;
  const completedSessions = active.userSessions.filter(
    (s) => s.status === 'completed'
  ).length;

  const progressPercent =
    totalSessions === 0 ? 0 : Math.round((completedSessions / totalSessions) * 100);

  const today = new Date();
  const daysFromStart = Math.max(
    0,
    Math.floor((today - active.startDate) / (1000 * 60 * 60 * 24))
  );

  const streakDays = await getStreakDays(userId);

  return {
    mission: {
      id: active.mission.id,
      title: active.mission.title,
      durationDays: active.mission.durationDays,
      sessionsPerWeek: active.mission.sessionsPerWeek,
    },
    userMission: {
      id: active.id,
      startDate: active.startDate,
      endDate: active.endDate,
      status: active.status,
    },
    stats: {
      totalSessions,
      completedSessions,
      progressPercent,
      daysFromStart,
      streakDays,
    },
  };
}

module.exports = {
  getActiveMissionProgress,
};
