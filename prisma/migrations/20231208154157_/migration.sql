/*
  Warnings:

  - You are about to drop the column `description` on the `challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `challenge` DROP COLUMN `description`;

-- CreateTable
CREATE TABLE `completionStatus` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `challengeId` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `completionStatus` ADD CONSTRAINT `completionStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `completionStatus` ADD CONSTRAINT `completionStatus_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `challenge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
