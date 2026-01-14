const prisma = require('../db/prisma');

async function generateUserMissionSessions(userMissionId, missionId, startDate) {
  const missionSessions = await prisma.missionSession.findMany({
    where: { missionId },
    orderBy: { dayIndex: 'asc' },
  });

  if (!missionSessions || missionSessions.length === 0) {
    throw new Error('MISSION_HAS_NO_SESSIONS');
  }

  const data = missionSessions.map((ms) => {
    const scheduledDate = new Date(startDate);
    scheduledDate.setDate(startDate.getDate() + (ms.dayIndex - 1));

    return {
      userMissionId,
      missionSessionId: ms.id,
      scheduledDate,
      status: 'scheduled', // atau 'PENDING', sesuai konvensi kamu
    };
  });

  await prisma.userMissionSession.createMany({ data });
}

module.exports = { generateUserMissionSessions };
