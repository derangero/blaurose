import { Timecard } from '@/types';
import { prisma } from '@/lib/prisma/Prisma';
import { DateTime } from 'luxon';

export async function FindPreviousByStampedOnAndEmployeeId(stampedOn: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      select: {
        work_start_at: true,
        work_end_at: true,
        rest_start_at: true,
        rest_end_at: true
      },
      where: { 
        stamped_on: parseInt(stampedOn),
        employee_id: employeeId,
        work_end_at: null
      }
    })
    return result;
  }

export async function FindByStampedOnAndEmployeeId(stampedOn: string, employeeId: string) : Timecard {
    const result = await prisma.timecard.findFirst({
      where: { 
        stamped_on: parseInt(stampedOn),
        employee_id: employeeId
      }
    })
    return result;
}

export async function findWorkingDataByStampedOnAndEmployeeId(stampedOn: string, employeeId: string) : Timecard {
  const result = await prisma.timecard.findFirst({
    where: { 
      stamped_on: parseInt(stampedOn),
      employee_id: employeeId,
      work_end_at: null
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
      work_end_at: stampedToAt.toISO(),
      rest_minutes_time: restMinutes,
      actual_working_minutes_time: actualWorkingMinutes,
    },
  }) 
  return result;
}

export async function UpsertByStampedOnAndEmployeeId(stampedOn: string, employeeId: string, workEndAt :DateTime,
  restMinutes:number|null, actualWorkingMinutes: number|null) : Timecard {
  const result = await prisma.timecard.upsert({
    where: {
        u_timecard_stamped_on_employee_id: {
            stamped_on: parseInt(stampedOn),
            employee_id: employeeId
        }
    },
    update: {
      work_end_at: workEndAt.toISO(),
      rest_minutes_time: restMinutes,
      actual_working_minutes_time: actualWorkingMinutes,
    },
    create: {
        stamped_on: parseInt(stampedOn),
        work_end_at: workEndAt.toISO(),
        employee_id: employeeId,
    },
  }) 
  return result;
}

export async function insertByStampedOnAndEmployeeId(stampedOn: string, employeeId: string, workStartAt: DateTime) : Timecard {
  const result = await prisma.timecard.create({
    data: {
        stamped_on: parseInt(stampedOn),
        work_start_at: workStartAt.toISO(),
        employee_id: employeeId,
    },
  }) 
  return result;
}

export async function updateByStampedOnAndEmployeeId(updatedTimecard: Timecard) : Timecard {
  const result = await prisma.timecard.update({
    where: {
        u_timecard_stamped_on_employee_id: {
            stamped_on: parseInt(updatedTimecard.stamped_on),
            employee_id: updatedTimecard.employee_id
        }
    },
    data: {
      work_end_at: updatedTimecard.work_end_at,
      rest_start_at: updatedTimecard.rest_start_at,
      rest_end_at: updatedTimecard.rest_end_at
    },
  }) 
  return result;
}
