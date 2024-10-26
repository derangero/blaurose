import { Session } from 'next-auth'
import { DateTime,Settings } from "luxon";
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../repositories/timecard/dba_timecard'
import { MainStampResult } from '@/models/main/mainModels';

export async function upsertTimecard(session: Session | null): Promise<MainStampResult>  {
    try {
        Settings.defaultLocale = 'ja';
        const today = DateTime.local();
        const yesterday = DateTime.local().minus({days: 1});
        const employeeId = session?.user.name.employee.employee_id;
        let stampedByPreviousMark = false;

        const todayForUpdate = DateTime.local();
        let workedMinutes = null;
        let restMinutesForUpdate = null;
        let actualWorkingMinutesForUpdate = null;

        let timecard = await FindPreviousByStampedOnAndEmployeeId(yesterday.toFormat('yyyyMMdd'), employeeId);
        if (timecard) {
            workedMinutes = calcWorkedMinutes(timecard.stampedFrom_at, today);
            restMinutesForUpdate = calcRestMinutes(workedMinutes)
            actualWorkingMinutesForUpdate = calcActualWorkingMinutesTime(workedMinutes, restMinutesForUpdate)
            
            timecard = await UpdateByStampedOnAndEmployeeId(
                yesterday.toFormat('yyyyMMdd'),
                employeeId,
                todayForUpdate,
                restMinutesForUpdate,
                actualWorkingMinutesForUpdate
            )
            stampedByPreviousMark = true;
        } else {
            timecard = await FindByStampedOnAndEmployeeId(today.toFormat('yyyyMMdd'), employeeId);
            if (timecard) {
                workedMinutes = calcWorkedMinutes(timecard.stampedFrom_at, today);
                restMinutesForUpdate = calcRestMinutes(workedMinutes)
                actualWorkingMinutesForUpdate = calcActualWorkingMinutesTime(workedMinutes, restMinutesForUpdate)
            }
            timecard = await UpsertByStampedOnAndEmployeeId(
                today.toFormat('yyyyMMdd'),
                employeeId,
                todayForUpdate,
                restMinutesForUpdate,
                actualWorkingMinutesForUpdate
            )
        }

        return {
            stampedFromAt: timecard && timecard.stampedFrom_at
                ? DateTime.fromJSDate(timecard?.stampedFrom_at).toFormat('HH:mm') : "",
            stampedToAt: timecard && timecard.stampedTo_at
                ? DateTime.fromJSDate(timecard?.stampedTo_at).toFormat('HH:mm') : "",
            stampedByPreviousMark: stampedByPreviousMark
        } ;
    } catch (error) {
        return {}
    }
}

function calcWorkedMinutes(stampedFrom_at:Date, stampedTo_at:DateTime): number {
    if (stampedFrom_at == null || stampedTo_at == null) {
        return 0;
    }

    const stampedFromAt = DateTime.fromJSDate(stampedFrom_at);
    const stampedToAt = stampedTo_at;
    const diff = stampedToAt.diff(stampedFromAt, 'minute');
    const workedMinutes = Math.round(diff.minutes); // 四捨五入

    return workedMinutes;
}

function calcRestMinutes(workedMinutes: number): number {
    let restMinutes = 0;
    if (workedMinutes >= 405) { // 6時間45分以上　※TODO:設定ファイルから取得
        restMinutes = 45;  // 45分休憩       ※TODO:設定ファイルから取得
    } else if (workedMinutes >= 480) { // 8時間00分以上　※TODO:設定ファイルから取得
        restMinutes = 60;  // 60分休憩       ※TODO:設定ファイルから取得
    }
    return restMinutes;
}

function calcActualWorkingMinutesTime(workedMinutes: number, restMinutes?: number): number | null {
    if (restMinutes != null) {
        return workedMinutes - restMinutes;
    }
    return null;
}

export default upsertTimecard	



