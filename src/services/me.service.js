const prisma = require('../db/prisma');

function computeProfileComplete(user) {
  const required = [
    user.gender,
    user.birthDate,
    user.heightCm,
    user.weightKg,
    user.goal,
  ];
  return required.every((v) => v !== null && v !== undefined);
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isProfileComplete = computeProfileComplete(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birthDate: user.birthDate,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    experienceLevel: user.experienceLevel,
    goal: user.goal,
    activityLevel: user.activityLevel,
    healthFlags: user.healthFlags,
    createdAt: user.createdAt,
    isProfileComplete,
  };
}

async function updateMyProfile(userId, payload) {
  // birthDate dari string ke Date kalau dikirim
  const data = { ...payload };
  if (data.birthDate) {
    data.birthDate = new Date(data.birthDate);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const isProfileComplete = computeProfileComplete(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birthDate: user.birthDate,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    experienceLevel: user.experienceLevel,
    goal: user.goal,
    activityLevel: user.activityLevel,
    healthFlags: user.healthFlags,
    createdAt: user.createdAt,
    isProfileComplete,
  };
}

module.exports = { getMe, updateMyProfile };
