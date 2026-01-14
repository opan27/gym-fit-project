// src/services/missionRecommendation.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Map activity level (user profile) ke range sessionsPerWeek mission
 * Contoh:
 * - low    -> 2–3 sesi ringan
 * - moderate -> 3–4 sesi
 * - high   -> 4–6 sesi
 */
function mapActivityToSessions(activityLevel) {
  switch (activityLevel) {
    case 'low':
      return { min: 2, max: 3 };
    case 'high':
      return { min: 4, max: 6 };
    case 'moderate':
    default:
      return { min: 3, max: 4 };
  }
}

/**
 * Map experience level ke fokus mission (lebih banyak teknik / volume)
 */
function mapExperienceToPreference(experienceLevel) {
  switch (experienceLevel) {
    case 'beginner':
      return { preferSimple: true, preferHighVolume: false };
    case 'advanced':
      return { preferSimple: false, preferHighVolume: true };
    case 'intermediate':
    default:
      return { preferSimple: false, preferHighVolume: false };
  }
}

/**
 * Hitung BMI dan kategori
 * heightCm: number
 * weightKg: number
 */
function calcBmiCategory(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;

  const h = heightCm / 100;
  const bmi = weightKg / (h * h);

  let category = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  return { bmi, category };
}

/**
 * Rekomendasi missions berdasarkan profil user
 * - goal (lose_fat, gain_muscle, general_health, dll)
 * - activityLevel (low | moderate | high)
 * - experienceLevel (beginner | intermediate | advanced)
 * - weightKg, heightCm -> BMI
 */
async function getRecommendedMissionsForUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      goal: true,              // 'lose_fat', 'gain_muscle', 'general_health', ...
      activityLevel: true,     // 'low' | 'moderate' | 'high'
      experienceLevel: true,   // 'beginner' | 'intermediate' | 'advanced'
      weightKg: true,
      heightCm: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { goal, activityLevel, experienceLevel, weightKg, heightCm } = user;

  const bmiInfo = calcBmiCategory(weightKg, heightCm);
  const activitySessions = mapActivityToSessions(activityLevel);
  const experiencePref = mapExperienceToPreference(experienceLevel);

  // 1. Ambil mission dengan goal yang sesuai + general_health sebagai fallback
  let missions = await prisma.mission.findMany({
    where: {
      ...(goal
        ? {
            OR: [
              { goalType: goal },
              { goalType: 'general_health' },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // 2. Filter berdasarkan sessionsPerWeek dibanding activity level user
  if (activitySessions) {
    missions = missions.filter((m) => {
      if (m.sessionsPerWeek == null) return true;
      return (
        m.sessionsPerWeek >= activitySessions.min &&
        m.sessionsPerWeek <= activitySessions.max
      );
    });
  }

  // 3. Filter / adjust berdasarkan BMI category
  if (bmiInfo) {
    const { category } = bmiInfo;

    // Contoh rule:
    // - overweight / obese + goal lose_fat:
    //   * prioritas mission lose_fat & general_health
    //   * hindari mission super berat (gain_muscle high volume) di awal
    if ((category === 'overweight' || category === 'obese') && goal === 'lose_fat') {
      missions = missions.filter((m) => {
        // misal kalau kamu punya field intensityLevel di mission (low/medium/high),
        // bisa juga cek di sini.
        if (m.goalType === 'gain_muscle') return false;
        return true;
      });
    }

    // - underweight:
    //   * hindari mission lose_fat
    if (category === 'underweight') {
      missions = missions.filter((m) => m.goalType !== 'lose_fat');
    }
  }

  // 4. Fine-tune sedikit pakai experience level (kalau kamu punya field di mission)
  // Contoh: misal mission punya field "isBeginnerFriendly" dan "estimatedDurationMinutes"
  missions = missions.map((m) => {
    let score = 0;

    // Sesuai goal
    if (goal && m.goalType === goal) score += 3;
    if (m.goalType === 'general_health') score += 1;

    // Sesuai sessionsPerWeek
    if (
      activitySessions &&
      m.sessionsPerWeek >= activitySessions.min &&
      m.sessionsPerWeek <= activitySessions.max
    ) {
      score += 2;
    }

    // Experience-based scoring (asumsi field ada di mission)
    if (experiencePref.preferSimple && m.isBeginnerFriendly) score += 2;
    if (experiencePref.preferHighVolume && m.sessionsPerWeek >= 4) score += 2;

    return { ...m, _score: score };
  });

  // Sort by score desc, lalu createdAt asc
  missions.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Optional: limit top N rekomendasi
  const topMissions = missions.slice(0, 10).map(({ _score, ...rest }) => rest);

  return {
    user: {
      id: user.id,
      goal,
      activityLevel,
      experienceLevel,
      weightKg,
      heightCm,
      bmi: bmiInfo ? bmiInfo.bmi : null,
      bmiCategory: bmiInfo ? bmiInfo.category : null,
    },
    missions: topMissions,
  };
}

module.exports = {
  getRecommendedMissionsForUser,
  calcBmiCategory,
  mapActivityToSessions,
  mapExperienceToPreference,
};
