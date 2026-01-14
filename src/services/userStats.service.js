// src/services/userStats.service.js
const prisma = require('../db/prisma');

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Minggu
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Senin awal minggu
  d.setDate(diff);
  return startOfDay(d);
}

async function getUserStatsService(userId) {
  const now = new Date();

  const weekStart = startOfWeek(now);
  const weekEnd = endOfDay(now);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekEnd);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

  // 1) Mission aktif
  const activeMission = await prisma.userMission.findFirst({
    where: { userId, status: 'active' },
    include: {
      mission: true,
    },
  });

  let missionProgress = null;

  if (activeMission) {
    // ambil semua session milik userMission ini
    const sessions = await prisma.userMissionSession.findMany({
      where: { userMissionId: activeMission.id },
      select: { status: true },
    });

    if (sessions.length > 0) {
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(
        (s) => s.status === 'completed'
      ).length;

      missionProgress = {
        missionId: activeMission.missionId,
        title: activeMission.mission.title,
        totalSessions,
        completedSessions,
        progressPercent: Math.round(
          (completedSessions / totalSessions) * 100
        ),
      };
    }
  }

  // 2) This week stats
  const thisWeekLogs = await prisma.userSessionLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  });

  const thisWeek = {
    sessions: thisWeekLogs.length,
    totalDurationMinutes: thisWeekLogs.reduce(
      (sum, l) => sum + (l.actualDurationMinutes || 0),
      0
    ),
    totalCalories: thisWeekLogs.reduce(
      (sum, l) => sum + (l.caloriesEstimated || 0),
      0
    ),
  };

  // 3) Last week stats
  const lastWeekLogs = await prisma.userSessionLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: lastWeekStart,
        lte: lastWeekEnd,
      },
    },
  });

  const lastWeek = {
    sessions: lastWeekLogs.length,
    totalDurationMinutes: lastWeekLogs.reduce(
      (sum, l) => sum + (l.actualDurationMinutes || 0),
      0
    ),
    totalCalories: lastWeekLogs.reduce(
      (sum, l) => sum + (l.caloriesEstimated || 0),
      0
    ),
  };

  // 4) Streak harian
  const recentLogs = await prisma.userSessionLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 60,
  });

  const uniqueDays = new Set(
    recentLogs.map((l) => startOfDay(l.createdAt).toISOString())
  );

  let streak = 0;
  let cursor = startOfDay(now).toISOString();
  while (uniqueDays.has(cursor)) {
    streak += 1;
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = startOfDay(d).toISOString();
  }

  return {
    currentMission: missionProgress,
    thisWeek,
    lastWeek,
    streak: {
      daysActiveInRow: streak,
    },
  };
}

module.exports = {
  getUserStatsService,
};
