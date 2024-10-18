import { getServerSession, NextAuthOptions } from 'next-auth'
//import authOptions from "../api/auth/[...nextauth]"
import { DateTime,Settings } from "luxon";
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, ListByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../../prisma/timecard/dba_timecard'
import { Timecard } from '@prisma/client';

// export const config = {
//     providers: authOptions.providers, // rest of your config
// } satisfies NextAuthOptions
  
const workList = async (
    req: { body: { fromYearMonthDay: string; toYearMonthDay: string } },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; param?: any }): any; new(): any } } }) => {

        //フロントエンド側からのデータを受け取る
    const { fromYearMonthDay, toYearMonthDay } = req.body

    let timecards = await ListByStampedOnAndEmployeeId(
        fromYearMonthDay,
        toYearMonthDay,
        "3"
        //sessionData.employeeId
    );
    return res.status(200).json({ message: "ログイン成功",  param: timecards });
}

export default workList;