/*
  Warnings:

  - You are about to drop the column `created_at` on the `t_timecard` table. All the data in the column will be lost.
  - You are about to drop the column `stamp_delete` on the `t_timecard` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `t_timecard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "t_timecard" DROP COLUMN "created_at",
DROP COLUMN "stamp_delete",
DROP COLUMN "updated_at";
