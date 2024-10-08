/*
  Warnings:

  - A unique constraint covering the columns `[login_id]` on the table `m_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `m_users_login_id_idx` ON `m_users`;

-- AlterTable
ALTER TABLE `m_employees` ADD COLUMN `stamp_hq` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `m_users_login_id_key` ON `m_users`(`login_id`);

-- CreateIndex
CREATE INDEX `m_users_login_id_password_idx` ON `m_users`(`login_id`, `password`);
