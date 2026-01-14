// src/services/mission.service.js
const prisma = require('../db/prisma');

/**
 * Ambil detail mission + sessions (TANPA assign ke user)
 */
async function getMissionDetailService(missionId) {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      missionSessions: {
        include: {
          exercises: {
            include: { exercise: true },
          },
        },
      },
    },
  });

  if (!mission) {
    const err = new Error('MISSION_NOT_FOUND');
    err.code = 'MISSION_NOT_FOUND';
    throw err;
  }

  // bentuk summary sesuai kebutuhan FE (tanpa userMission)
  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    goalType: mission.goalType,
    durationDays: mission.durationDays,
    sessionsPerWeek: mission.sessionsPerWeek,
    // kalau mau kirim sesi2-nya:
    sessions: mission.missionSessions.map((s) => ({
      id: s.id,
      dayIndex: s.dayIndex,
      title: s.title,
      description: s.description,
      targetDurationMin: s.targetDurationMin,
      exercises: s.exercises.map((e) => ({
        id: e.id,
        exerciseId: e.exerciseId,
        name: e.exercise.name,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
      })),
    })),
  };
}

/**
 * Logic assign mission (gunakan chooseMissionService lama kamu)
 * kalau masih butuh assign aktif.
 */
async function assignMissionAndGetDetail(userId, missionId) {
  // di sini kamu bisa pakai ulang chooseMissionService atau adaptasinya,
  // tapi karena fokus kamu sekarang ke summary tanpa assign,
  // fungsi ini boleh tetap seperti versi chooseMissionService lama.
}

module.exports = {
  getMissionDetailService,
  assignMissionAndGetDetail,
};
