/*
  Warnings:

  - You are about to drop the column `stamped_at` on the `t_timecard` table. All the data in the column will be lost.
  - You are about to drop the column `stamped_from` on the `t_timecard` table. All the data in the column will be lost.
  - You are about to drop the column `stamped_to` on the `t_timecard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stamped_on,employee_id]` on the table `t_timecard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stamped_on` to the `t_timecard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "t_timecard_stamped_at_employee_id_key";

-- DropIndex
DROP INDEX "t_timecard_stamped_from_stamped_to_idx";

-- AlterTable
ALTER TABLE "m_companies" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "m_employees" ALTER COLUMN "company_joined_at" SET DATA TYPE DATE,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "m_shops" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "m_users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "t_timecard" DROP COLUMN "stamped_at",
DROP COLUMN "stamped_from",
DROP COLUMN "stamped_to",
ADD COLUMN     "stampedFrom_at" TIMESTAMPTZ(3),
ADD COLUMN     "stampedTo_at" TIMESTAMPTZ(3),
ADD COLUMN     "stamped_on" DATE NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateIndex
CREATE UNIQUE INDEX "t_timecard_stamped_on_employee_id_key" ON "t_timecard"("stamped_on", "employee_id");
