/*
  Warnings:

  - You are about to drop the `MCompanies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `MCompanies`;

-- CreateTable
CREATE TABLE `m_companies` (
    `company_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_code` CHAR(4) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `stamp_delete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `m_companies_company_code_key`(`company_code`),
    INDEX `m_companies_company_code_idx`(`company_code`),
    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
