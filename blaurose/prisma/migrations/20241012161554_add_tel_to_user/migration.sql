/*
  Warnings:

  - Changed the type of `stamped_on` on the `t_timecard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "t_timecard" DROP COLUMN "stamped_on",
ADD COLUMN     "stamped_on" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "t_timecard_stamped_on_employee_id_key" ON "t_timecard"("stamped_on", "employee_id");
