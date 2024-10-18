import { SetStateAction, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ListByStampedOnAndEmployeeId } from '../../../prisma/timecard/dba_timecard'
import { SessionData, Timecard } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession, NextAuthOptions } from 'next-auth';
import authOptions from "../api/auth/[...nextauth]"
import { DateTime } from 'luxon';
import { CustumDatePicker } from '@/components/date/CustumDatePicker';

type WorkListRow  = {
    id? :   string,
    date?:   string,
    stampedFromAt?:   string,
    stampedToAt?:   string,
    restTime?:   string,
    allWorkingTime?:   string,
    overtime?:   string,
    lateNightWorkTime?:   string,
    holidayWorkTime?:   string,
}

export const config = {
    providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions
  
  export const getServerSideProps = (async (context: any) => {
    const session = await getServerSession(context.req, context.res, config)
    const shopCode = session?.user.name.employee.shop.shop_code;
    const shopName = session?.user.name.employee.shop.shop_name;
    const employeeName = session?.user.name.employee.employee_name;
    const employeeId = session?.user.name.employee.employee_id;
    const sessionData = {
      shopCode: shopCode,
      shopName: shopName,
      employeeName: employeeName,
      employeeId: employeeId,
      stampedFromAt: "",
      stampedToAt: "",
      stampedByPreviousMark: ""
    }
    const nowDate = DateTime.now();
    const fromYearMonthDay = nowDate.startOf('month');
    const toYearMonthDay = nowDate.endOf('month');
    let timecards = await ListByStampedOnAndEmployeeId(
        fromYearMonthDay.toFormat('yyyyMMdd'),
        toYearMonthDay.toFormat('yyyyMMdd'),
        sessionData.employeeId
    );
    const initRows: WorkListRow[] = [];

    if (timecards) {
        const timecardMap = timecards.reduce((p: Timecard, c: { stamped_on: number; }
            ) => Object.defineProperty(p, c.stamped_on, { value: c }), {}); 

        for (let i = 1; i < parseInt(toYearMonthDay.toFormat('dd')) + 1; i++) {
            const targetDate = DateTime.local(toYearMonthDay.year, toYearMonthDay.month, i);
            const timecard = timecardMap[parseInt(targetDate.toFormat('yyyyMMdd'))];
            const stampedFromAt = timecard ? DateTime.fromJSDate(timecard.stampedFrom_at).toFormat('hh:mm') : ""
            const stampedToAt = timecard ? DateTime.fromJSDate(timecard.stampedTo_at).toFormat('hh:mm') : ""
            initRows.push({
                id: targetDate.toFormat('yyyyMMdd'),
                date: targetDate.toFormat('MM/dd（EEE）'),
                stampedFromAt: stampedFromAt,
                stampedToAt: stampedToAt,
                restTime: "",
                allWorkingTime: "",
                overtime: "",
                lateNightWorkTime: "",
                holidayWorkTime: "",
            });
        }
    }
    return {
      props: { sessionData, initRows }
    }
  }) satisfies GetServerSideProps<{ sessionData: SessionData, rows: WorkListRow[] }>

//  const workList: React.FC = () => {
const workList: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({sessionData, initRows}) => {
    //const rows = [];
    const [rows, setRows] = useState(initRows);
    const onChangeDatePicker = async (date: Date | null) => {
        if (date) {
            //const timecards = await GetWorkList(date);
            const fromYearMonthDay =  DateTime.fromJSDate(date).startOf("month")
            const toYearMonthDay =  DateTime.fromJSDate(date).endOf("month")
            const fetchAsyncAddUser = async () => {
                // APIのURL
                const url = process.env.NEXT_PUBLIC_SERVICE_URL_BASE + "api/workList";
                // リクエストパラメータ
                const params = {
                    method: "POST",
                    // JSON形式のデータのヘッダー
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // リクエストボディ
                    body: JSON.stringify({
                        fromYearMonthDay: fromYearMonthDay.toFormat('yyyyMMdd'),
                        toYearMonthDay: toYearMonthDay.toFormat('yyyyMMdd')
                    }),
                };
                // APIへのリクエスト
                const response = await fetch(url, params);
                const result = await response.json();

                const timecards = result.param;
                const initRows: WorkListRow[] = [];
                if (timecards.length > 0) {
                    const timecardMap = timecards.reduce((p: Timecard, c: { stamped_on: number; }
                    ) => Object.defineProperty(p, c.stamped_on, { value: c }), {}); 
        
                    for (let i = 1; i < parseInt(toYearMonthDay.toFormat('dd')) + 1; i++) {
                    const targetDate = DateTime.local(toYearMonthDay.year, toYearMonthDay.month, i);
                    const timecard = timecardMap[parseInt(targetDate.toFormat('yyyyMMdd'))];
                    const stampedFromAt = timecard ? DateTime.fromISO(timecard.stampedFrom_at).toFormat('hh:mm') : ""
                    const stampedToAt = timecard ? DateTime.fromISO(timecard.stampedTo_at).toFormat('hh:mm') : ""
                    initRows.push({
                        id: targetDate.toFormat('yyyyMMdd'),
                        date: targetDate.toFormat('MM/dd（EEE）'),
                        stampedFromAt: stampedFromAt,
                        stampedToAt: stampedToAt,
                        restTime: "",
                        allWorkingTime: "",
                        overtime: "",
                        lateNightWorkTime: "",
                        holidayWorkTime: "",
                    });
                }
                } else {
                    //
                }
                setRows(initRows);
            }
            fetchAsyncAddUser()
        }
    }
    const columns = [
        { key: 'date', name: '日付' },
        { key: 'stampedFromAt', name: '出社' },
        { key: 'stampedToAt', name: '退社' },
        { key: 'restTime', name: '休憩' },
        { key: 'allWorkingTime', name: '総労働' },
        { key: 'overtime', name: '残業' },
        { key: 'lateNightWorkTime', name: '深夜労働' },
        { key: 'holidayWorkTime', name: '休日労働' },
    ];
    
    return (
        <div>
            <CustumDatePicker onChangeDatePicker={onChangeDatePicker}/>
            <DataGrid columns={columns} rows={rows} />
        </div>
    )
}
   
export default workList