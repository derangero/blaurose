import { DateTime,Settings } from "luxon";
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, ListByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../../prisma/timecard/dba_timecard'
import { Timecard } from '@prisma/client';
import { SessionData } from '@/types';

const _workList = async (
    req: { body: { fromYearMonthDay: string; toYearMonthDay: string, employeeId: string } },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; param?: any }): any; new(): any } } }) => {

        //フロントエンド側からのデータを受け取る
    const { fromYearMonthDay, toYearMonthDay, employeeId } = req.body

    const timecards = await _getTimecards(
        fromYearMonthDay,
        toYearMonthDay,
        employeeId
    );
    return res.status(200).json({ message: "ログイン成功",  param: timecards });
}

export async function GetTimecards(sessionData : SessionData) : Promise<Timecard[]> {
    const nowDate = DateTime.now();
    const fromYearMonthDay = nowDate.startOf('month');
    const toYearMonthDay = nowDate.endOf('month');

    const timecards = await _getTimecards(
        fromYearMonthDay.toFormat('yyyyMMdd'),
        toYearMonthDay.toFormat('yyyyMMdd'),
        sessionData.employeeId);
    return timecards;
}

async function _getTimecards(fromYearMonthDay:string,toYearMonthDay:string,employeeId:string) : Promise<Timecard[]> {
    const timecards = await ListByStampedOnAndEmployeeId(
        fromYearMonthDay,
        toYearMonthDay,
        employeeId
    );
    return timecards;
}
    
export default _workList;