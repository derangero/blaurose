import { PrismaClient } from '@prisma/client';
import { Timecard } from '@/types';
import { prisma } from '../../../prisma/Prisma';
import { DateTime } from 'luxon';

export async function FindPreviousByStampedOnAndEmployeeId(stampedOn: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      select: {
        stampedFrom_at: true,
        stampedTo_at: true
      },
      where: { 
        stamped_on: parseInt(stampedOn),
        employee_id: employeeId,
        stampedTo_at: null
      }
    })
    return result;
  }

export async function FindByStampedOnAndEmployeeId(stampedOn: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      select: {
        stampedFrom_at: true,
        stampedTo_at: true
      },
      where: { 
        stamped_on: parseInt(stampedOn),
        employee_id: employeeId
      }
    })
    return result;
  }

  export async function ListByStampedOnAndEmployeeId(stampedOnFrom: string, stampedOnTo: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findMany({
      where: { 
        stamped_on: {
          gte: parseInt(stampedOnFrom),
          lte:  parseInt(stampedOnTo)
        },
        employee_id: employeeId
      },
      orderBy: {
        stamped_on: 'asc',
      },
    })
    return result;
  }

export async function UpdateByStampedOnAndEmployeeId(stampedOn: string,
  employeeId: string, stampedToAt :DateTime, restMinutes:number | null, actualWorkingMinutes: number | null) : Timecard {
  const result = await prisma.timecard.update({
    where: {
        u_timecard_stamped_on_employee_id: {
            stamped_on: parseInt(stampedOn),
            employee_id: employeeId
        }
    },
    data: {
      stampedTo_at: stampedToAt.toISO(),
      rest_minutes_time: restMinutes,
      actual_working_minutes_time: actualWorkingMinutes,
    },
  }) 
  return result;
}

export async function UpsertByStampedOnAndEmployeeId(stampedOn: string, employeeId: string, stampedToAt :DateTime,
  restMinutes:number|null, actualWorkingMinutes: number|null) : Timecard {
  const result = await prisma.timecard.upsert({
    where: {
        u_timecard_stamped_on_employee_id: {
            stamped_on: parseInt(stampedOn),
            employee_id: employeeId
        }
    },
    update: {
      stampedTo_at: stampedToAt.toISO(),
      rest_minutes_time: restMinutes,
      actual_working_minutes_time: actualWorkingMinutes,
    },
    create: {
        stamped_on: parseInt(stampedOn),
        stampedFrom_at: stampedToAt.toISO(),
        employee_id: employeeId,
    },
  }) 
  return result;
}