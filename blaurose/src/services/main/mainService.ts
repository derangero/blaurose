import { Session } from 'next-auth'
import { DateTime,Settings } from "luxon";
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, findWorkingDataByStampedOnAndEmployeeId, insertByStampedOnAndEmployeeId, updateByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../repositories/timecard/dba_timecard'
import { MainStampResult } from '@/models/main/mainModels';
import { Timecard } from '@/types';
Settings.defaultLocale = 'ja';

export async function startWork(session: Session | null): Promise<string | null> {
    try {
        const today = DateTime.local();
        const employeeId = session?.user.name.employee.employee_id;
        let timecard = await FindByStampedOnAndEmployeeId(
            today.toFormat('yyyyMMdd'),
            employeeId
        )

        const errorMsg = await validateStartWork(timecard); 
        if (errorMsg) {
            return errorMsg;
        }

        await insertByStampedOnAndEmployeeId(
            today.toFormat('yyyyMMdd'),
            employeeId,
            today
        )

        return '';
    } catch (error) {
        throw error
    }
}

export async function endWork(session: Session | null): Promise<string | null> {
    try {
        const today = DateTime.local();
        const employeeId = session?.user.name.employee.employee_id;
        let timecard = await FindByStampedOnAndEmployeeId(
            today.toFormat('yyyyMMdd'),
            employeeId
        )
        // 前日分の日跨ぎ打刻用にタイムカード取得
        if (!timecard){
            timecard = await findWorkingDataByStampedOnAndEmployeeId(
                today.minus({days:1}).toFormat('yyyyMMdd'),
                employeeId
            )
        }

        const errorMsg = await validateEndWork(timecard); 
        if (errorMsg) {
            return errorMsg;
        }

        timecard.work_end_at = today.toJSDate();
        await updateByStampedOnAndEmployeeId(
            timecard
        )

        return '';
    } catch (error) {
        throw error;
    }
}

export async function startRest(session: Session | null): Promise<string | null> {
    try {
        const today = DateTime.local();
        const employeeId = session?.user.name.employee.employee_id;
        let timecard = await FindByStampedOnAndEmployeeId(
            today.toFormat('yyyyMMdd'),
            employeeId
        )
        // 前日分の日跨ぎ打刻用にタイムカード取得
        if (!timecard){
            timecard = await findWorkingDataByStampedOnAndEmployeeId(
                today.minus({days:1}).toFormat('yyyyMMdd'),
                employeeId
            )
        }

        const errorMsg = await validateStartRest(timecard); 
        if (errorMsg) {
            return errorMsg;
        }

        timecard.rest_start_at = today.toJSDate();
        await updateByStampedOnAndEmployeeId(
            timecard
        )

        return '';
    } catch (error) {
        throw new Error('endWork error')
    }
}

export async function endRest(session: Session | null): Promise<string | null> {
    try {
        const today = DateTime.local();
        const employeeId = session?.user.name.employee.employee_id;
        let timecard = await FindByStampedOnAndEmployeeId(
            today.toFormat('yyyyMMdd'),
            employeeId
        )
        // 前日分の日跨ぎ打刻用にタイムカード取得
        if (!timecard){
            timecard = await findWorkingDataByStampedOnAndEmployeeId(
                today.minus({days:1}).toFormat('yyyyMMdd'),
                employeeId
            )
        }

        const errorMsg = await validateEndRest(timecard); 
        if (errorMsg) {
            return errorMsg;
        }

        timecard.rest_end_at = today.toJSDate();
        await updateByStampedOnAndEmployeeId(
            timecard
        )

        return '';
    } catch (error) {
        throw new Error('endWork error')
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

async function isExistTimecard(stampedOn: DateTime, employeeId: string ) {
    let timecard = await FindByStampedOnAndEmployeeId(
        stampedOn.toFormat('yyyyMMdd'),
        employeeId
    )

    return timecard != null;
}

async function validateStartWork(timecard: Timecard) : Promise<string | null> {
    if (timecard){
        return 'エラー：出勤後です。';
    }

    return null;
}

async function validateEndWork(timecard: Timecard) {
    if (!timecard) {
        return 'エラー：出勤前です。'
    }
    if (timecard.rest_start_at && !timecard.rest_end_at) {
        return 'エラー：休憩中です。休憩後に再度打刻してください。'
    }
    if (timecard.work_end_at) {
        return 'エラー：退勤後です。'
    }
    
    return null;
}
async function validateStartRest(timecard: Timecard) {
    if (!timecard) {
        return 'エラー：出勤前です。'
    }
    if (timecard.rest_start_at && !timecard.rest_end_at) {
        return 'エラー：休憩中です。'
    }
    if (timecard.rest_end_at) {
        return 'エラー：休憩後です。'
    }
    
    return null;
}

async function validateEndRest(timecard: Timecard) {
    if (!timecard) {
        return 'エラー：出勤前です。'
    }
    if (!timecard.rest_start_at) {
        return 'エラー：休憩前です。'
    }
    if (timecard.rest_end_at) {
        return 'エラー：休憩後です。'
    }
    
    return null;
}
