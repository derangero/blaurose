-- AlterTable
ALTER TABLE "t_timecard" ADD COLUMN     "actual_working_minutes_time" INTEGER,
ADD COLUMN     "rest_minutes_time" INTEGER;

-- CreateIndex
CREATE INDEX "t_timecard_stamped_on_idx" ON "t_timecard"("stamped_on");
