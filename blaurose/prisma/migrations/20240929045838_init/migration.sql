-- CreateTable
CREATE TABLE `MCompanies` (
    `company_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_code` CHAR(4) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `stamp_delete` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
