/*
  Warnings:

  - The primary key for the `m_companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `company_name` on table `m_companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `m_companies` DROP PRIMARY KEY,
    MODIFY `company_id` VARCHAR(191) NOT NULL,
    MODIFY `company_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`company_id`);

-- CreateTable
CREATE TABLE `m_employees` (
    `employee_id` VARCHAR(191) NOT NULL,
    `employee_code` CHAR(4) NOT NULL,
    `employee_name` VARCHAR(191) NOT NULL,
    `company_joined_at` DATETIME(3) NULL,
    `hourly_wage_amount` INTEGER NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `stamp_delete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `m_employees_employee_id_key`(`employee_id`),
    INDEX `m_employees_employee_code_idx`(`employee_code`),
    PRIMARY KEY (`company_id`, `employee_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_users` (
    `user_id` VARCHAR(191) NOT NULL,
    `login_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `stamp_delete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `m_users_employee_id_key`(`employee_id`),
    INDEX `m_users_login_id_idx`(`login_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `m_employees` ADD CONSTRAINT `m_employees_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `m_companies`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_users` ADD CONSTRAINT `m_users_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `m_employees`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
