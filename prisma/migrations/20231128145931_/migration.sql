/*
  Warnings:

  - You are about to drop the `challange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `challange`;

-- CreateTable
CREATE TABLE `challenge` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `githubLink` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
