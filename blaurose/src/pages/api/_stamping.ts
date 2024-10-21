import { getServerSession, NextAuthOptions } from 'next-auth'
import authOptions from "../api/auth/[...nextauth]"
import { DateTime,Settings } from "luxon";
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../../prisma/timecard/dba_timecard'
import { Timecard } from '@prisma/client';

export const config = {
    providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions
  
export const Stamping = async (
    req: { body: { login_id: any; password: any } },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; param?: any }): any; new(): any } } }) => {
    try {
        const session = await getServerSession(req, res, config)
        Settings.defaultLocale = 'ja';
        const today = DateTime.local();
        const yesterday = DateTime.local().minus({days: 1});
        const employeeId = session?.user.name.employee.employee_id;
        let stampedByPreviousMark = false;

        const todayForUpdate = DateTime.local();
        let restMinutesTimeForUpdate = 0;
        let actualWorkingMinutesTimeForUpdate = 0;

        let timecard = await FindPreviousByStampedOnAndEmployeeId(yesterday.toFormat('yyyyMMdd'), employeeId);
        if (timecard) {
            restMinutesTimeForUpdate = calcRestMinutes(timecard?.stampedFrom_at, today)
            actualWorkingMinutesTimeForUpdate = calcActualWorkingMinutesTime(timecard)
            timecard = await UpdateByStampedOnAndEmployeeId(yesterday.toFormat('yyyyMMdd'), employeeId, todayForUpdate, restMinutesTimeForUpdate)


            stampedByPreviousMark = true;
        } else {
          timecard = await FindByStampedOnAndEmployeeId(today.toFormat('yyyyMMdd'), employeeId);
          restMinutesTimeForUpdate = calcRestMinutes(timecard?.stampedFrom_at, today)
          timecard = await UpsertByStampedOnAndEmployeeId(today.toFormat('yyyyMMdd'), employeeId, todayForUpdate, restMinutesTimeForUpdate)
        }

        return res.status(200).json({
        message: "打刻しました",
        param: {
                stampedFromAt: timecard && timecard.stampedFrom_at
                    ? DateTime.fromJSDate(timecard?.stampedFrom_at).toFormat('HH:mm') : "",
                stampedToAt: timecard && timecard.stampedTo_at
                    ? DateTime.fromJSDate(timecard?.stampedTo_at).toFormat('HH:mm') : "",
                stampedByPreviousMark: stampedByPreviousMark
            }
        });
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        return res.status(400).json({ message: "打刻エラーです。管理者にお問い合わせください。"})
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

function calcRestMinutes(stampedFrom_at:Date, stampedTo_at:DateTime): number {
    const workedMinutes = calcWorkedMinutes(stampedFrom_at, stampedTo_at); // 四捨五入

    let restMinutes = 0;
    if (workedMinutes >= 405) { // 6時間45分以上　※TODO:設定ファイルから取得
        restMinutes = 45;  // 45分休憩       ※TODO:設定ファイルから取得
    } else if (workedMinutes >= 480) { // 8時間00分以上　※TODO:設定ファイルから取得
        restMinutes = 60;  // 60分休憩       ※TODO:設定ファイルから取得
    }
    return restMinutes;
}


export default Stamping	

function calcActualWorkingMinutesTime(timecard: any): number {
    throw new Error('Function not implemented.');
}

