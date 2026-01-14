// prisma-seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // MISSION SESSION untuk missionId = 1
  await prisma.missionSession.createMany({
    data: [
      {
        missionId: 1,
        dayIndex: 1,
        title: 'Day 1 – Full Body Ringan',
        description: 'Bodyweight full body untuk pemula',
        targetDurationMin: 40,
      },
      {
        missionId: 1,
        dayIndex: 3,
        title: 'Day 2 – Cardio + Core',
        description: 'Jalan cepat + core basic',
        targetDurationMin: 35,
      },
      {
        missionId: 1,
        dayIndex: 5,
        title: 'Day 3 – Full Body + Mobility',
        description: 'Full body + stretching',
        targetDurationMin: 40,
      },
    ],
  });

  // MISSION SESSION untuk missionId = 2
  await prisma.missionSession.createMany({
    data: [
      { missionId: 2, dayIndex: 1, title: 'Day 1 – Upper Push A', description: 'Dada+bahu+triceps', targetDurationMin: 60 },
      { missionId: 2, dayIndex: 3, title: 'Day 2 – Upper Pull A', description: 'Back+biceps', targetDurationMin: 60 },
      { missionId: 2, dayIndex: 5, title: 'Day 3 – Upper Push B', description: 'Push variation', targetDurationMin: 60 },
      { missionId: 2, dayIndex: 7, title: 'Day 4 – Upper Pull B', description: 'Pull variation', targetDurationMin: 60 },
    ],
  });

  // MISSION SESSION untuk missionId = 3
  await prisma.missionSession.createMany({
    data: [
      { missionId: 3, dayIndex: 1, title: 'Day 1 – Jalan 20 Menit', description: 'Jalan santai untuk mulai gerak', targetDurationMin: 20 },
      { missionId: 3, dayIndex: 3, title: 'Day 2 – Stretching & Mobility', description: 'Gerakan mobilitas & stretching', targetDurationMin: 25 },
      { missionId: 3, dayIndex: 5, title: 'Day 3 – Aktivitas Bebas', description: 'Pilih aktivitas ringan sesuai selera', targetDurationMin: 30 },
    ],
  });

  console.log('Seed MissionSession done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
