import { PrismaClient } from '@prisma/client';
import { Timecard } from '@/types';

export async function GetTimecardByPrevious(prisma: PrismaClient, nowDate: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      select: {
        stampedFrom_at: true,
        stampedTo_at: true
      },
      where: { 
        stamped_on: parseInt(nowDate),
        employee_id: employeeId,
        stampedTo_at: null
      }
    })
    return result;
  }

export async function GetTimecard(prisma: PrismaClient, nowDate: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      select: {
        stampedFrom_at: true,
        stampedTo_at: true
      },
      where: { 
        stamped_on: parseInt(nowDate),
        employee_id: employeeId
      }
    })
    return result;
  }