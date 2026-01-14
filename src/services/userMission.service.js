const prisma = require('../db/prisma');
const { generateUserMissionSessions } = require('./userMissionSchedule.service');

// pilih mission + generate jadwal
async function chooseMissionService(userId, missionId) {
  // cek mission aktif existing
  const existing = await prisma.userMission.findFirst({
    where: { userId, status: 'active' },
  });
  if (existing) {
    throw new Error('ACTIVE_MISSION_EXISTS');
  }

  // ambil mission
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });
  if (!mission) {
    throw new Error('MISSION_NOT_FOUND');
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + mission.durationDays);

  // buat userMission
  const userMission = await prisma.userMission.create({
    data: {
      userId,
      missionId,
      startDate,
      endDate,
      status: 'active',
    },
  });

  // generate jadwal UserMissionSession berdasarkan MissionSession
  await generateUserMissionSessions(userMission.id, missionId, startDate);

  return { userMission, mission };
}

// ambil mission aktif user
async function getActiveMissionService(userId) {
  return prisma.userMission.findFirst({
    where: { userId, status: 'active' },
    include: { mission: true },
  });
}

// ambil semua sesi untuk mission aktif
async function getAllSessionsForActiveMissionService(userId) {
  const active = await prisma.userMission.findFirst({
    where: { userId, status: 'active' },
  });
  if (!active) return [];

  const sessions = await prisma.userMissionSession.findMany({
    where: { userMissionId: active.id },
    orderBy: { scheduledDate: 'asc' }, // urut dari awal ke akhir [web:282][web:286]
    include: {
      missionSession: {
        include: {
          exercises: {
            include: { exercise: true },
          },
        },
      },
    },
  });

  return sessions;
}

// ambil sesi hari ini untuk mission aktif
async function getTodaySessionService(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const session = await prisma.userMissionSession.findFirst({
    where: {
      userMission: {
        userId,
        status: 'active',
      },
      scheduledDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      missionSession: {
        include: {
          exercises: {
            include: { exercise: true },
          },
        },
      },
    },
  });

  return session;
}

module.exports = {
  chooseMissionService,
  getActiveMissionService,
  getAllSessionsForActiveMissionService,
  getTodaySessionService,
};
