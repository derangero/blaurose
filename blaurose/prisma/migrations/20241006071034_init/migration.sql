/*
  Warnings:

  - The primary key for the `m_employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `company_id` on the `m_employees` table. All the data in the column will be lost.
  - You are about to drop the column `stamp_hq` on the `m_employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_code]` on the table `m_employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop_id` to the `m_employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `m_employees` DROP FOREIGN KEY `m_employees_company_id_fkey`;

-- AlterTable
ALTER TABLE `m_employees` DROP PRIMARY KEY,
    DROP COLUMN `company_id`,
    DROP COLUMN `stamp_hq`,
    ADD COLUMN `shop_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`shop_id`, `employee_code`);

-- CreateTable
CREATE TABLE `m_shops` (
    `shop_id` VARCHAR(191) NOT NULL,
    `shop_code` CHAR(4) NOT NULL,
    `shop_name` VARCHAR(191) NOT NULL,
    `stamp_hq` BOOLEAN NOT NULL DEFAULT false,
    `company_id` VARCHAR(191) NOT NULL,
    `stamp_delete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `m_shops_shop_id_key`(`shop_id`),
    UNIQUE INDEX `m_shops_shop_code_key`(`shop_code`),
    INDEX `m_shops_shop_code_idx`(`shop_code`),
    PRIMARY KEY (`company_id`, `shop_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `m_employees_employee_code_key` ON `m_employees`(`employee_code`);

-- AddForeignKey
ALTER TABLE `m_shops` ADD CONSTRAINT `m_shops_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `m_companies`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_employees` ADD CONSTRAINT `m_employees_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `m_shops`(`shop_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
