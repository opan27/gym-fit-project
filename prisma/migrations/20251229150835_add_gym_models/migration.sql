-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `heightCm` INTEGER NULL,
    `weightKg` INTEGER NULL,
    `experienceLevel` VARCHAR(191) NULL,
    `goal` VARCHAR(191) NULL,
    `activityLevel` VARCHAR(191) NULL,
    `healthFlags` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `muscleGroup` VARCHAR(191) NULL,
    `equipment` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `goalType` VARCHAR(191) NOT NULL,
    `durationDays` INTEGER NOT NULL,
    `sessionsPerWeek` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MissionSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `missionId` INTEGER NOT NULL,
    `dayIndex` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `targetDurationMin` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MissionSessionExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `missionSessionId` INTEGER NOT NULL,
    `exerciseId` INTEGER NOT NULL,
    `targetSets` INTEGER NULL,
    `targetReps` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `missionId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMissionSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userMissionId` INTEGER NOT NULL,
    `missionSessionId` INTEGER NOT NULL,
    `scheduledDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `adherenceScore` DOUBLE NULL,
    `difficultyRating` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSessionLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userMissionSessionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `actualDurationMinutes` INTEGER NULL,
    `perceivedIntensity` INTEGER NULL,
    `caloriesEstimated` INTEGER NULL,
    `moodBefore` INTEGER NULL,
    `moodAfter` INTEGER NULL,
    `note` VARCHAR(191) NULL,
    `proofPhotoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserSessionLog_userMissionSessionId_key`(`userMissionSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSessionExerciseLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionLogId` INTEGER NOT NULL,
    `exerciseId` INTEGER NOT NULL,
    `setNumber` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,
    `weight` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserSessionExerciseLog_sessionLogId_idx`(`sessionLogId`),
    INDEX `UserSessionExerciseLog_exerciseId_idx`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MissionSession` ADD CONSTRAINT `MissionSession_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MissionSessionExercise` ADD CONSTRAINT `MissionSessionExercise_missionSessionId_fkey` FOREIGN KEY (`missionSessionId`) REFERENCES `MissionSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MissionSessionExercise` ADD CONSTRAINT `MissionSessionExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMission` ADD CONSTRAINT `UserMission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMission` ADD CONSTRAINT `UserMission_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMissionSession` ADD CONSTRAINT `UserMissionSession_userMissionId_fkey` FOREIGN KEY (`userMissionId`) REFERENCES `UserMission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMissionSession` ADD CONSTRAINT `UserMissionSession_missionSessionId_fkey` FOREIGN KEY (`missionSessionId`) REFERENCES `MissionSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSessionLog` ADD CONSTRAINT `UserSessionLog_userMissionSessionId_fkey` FOREIGN KEY (`userMissionSessionId`) REFERENCES `UserMissionSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSessionLog` ADD CONSTRAINT `UserSessionLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSessionExerciseLog` ADD CONSTRAINT `UserSessionExerciseLog_sessionLogId_fkey` FOREIGN KEY (`sessionLogId`) REFERENCES `UserSessionLog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSessionExerciseLog` ADD CONSTRAINT `UserSessionExerciseLog_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
