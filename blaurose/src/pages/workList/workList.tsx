import { forwardRef, SetStateAction, useMemo, useRef, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { Column, DataGridHandle } from 'react-data-grid';
import { SessionData, Timecard } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession, NextAuthOptions } from 'next-auth';
import authOptions from "../api/auth/[...nextauth]"
import { DateTime } from 'luxon';
import { CustumDatePicker } from '@/components/date/CustumDatePicker';
import { formatDisplayTime } from '../../components/util'
import { exportToPdf } from '../../components/export/exportUtils'
import { GetTimecards } from '../api/_workList';
import { flushSync } from 'react-dom';
//import { PDFDownloadLink } from '@react-pdf/renderer';
import dynamic from "next/dynamic";
import PDF from '@/components/pdf/PDF';
import ReactDatePicker, { registerLocale } from 'react-datepicker'

type WorkListRow  = {
    id? :   string,
    date?:   string,
    stampedFromAt?:   string,
    stampedToAt?:   string,
    restTime?:   number,
    actualWorkingTime?:   number,
    overtime?:   number,
    lateNightWorkTime?:   number,
    holidayWorkTime?:   number,
}
type WorkListSummaryRow = {
    id?: string,
    totalRestTime?:   number,
    totalActualWorkingTime?:   number,
    totalOvertime?:   number,
    totalLateNightWorkTime?:   number,
    totalHolidayWorkTime?:   number,
}
type PDFData = {
    yearMonth?: string,
    shopName: string,
    employeeName: string,
    rows:WorkListRow[],
    summaryRows:WorkListSummaryRow[]
}
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod. PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    },
  );

  async function _getSettionData(context: any) : Promise<SessionData> {
    const session = await getServerSession(context.req, context.res, config);

    return {
        shopCode: session?.user.name.employee.shop.shop_code,
        shopName: session?.user.name.employee.shop.shop_name,
        employeeName: session?.user.name.employee.employee_name,
        employeeId: session?.user.name.employee.employee_id,
   }
}

function _getWorkListRows(timecards : Timecard[]) {
    const rows: WorkListRow[] = [];
    if (timecards.length > 0) {
        const toYearMonthDay = DateTime.fromJSDate(new Date(timecards[0].stampedFrom_at)).endOf('month');
        const timecardMap = timecards.reduce((p: Timecard, c: { stamped_on: number; }
            ) => Object.defineProperty(p, c.stamped_on, { value: c }), {}); 

        for (let i = 1; i < parseInt(toYearMonthDay.toFormat('dd')) + 1; i++) {
            const targetDate = DateTime.local(toYearMonthDay.year, toYearMonthDay.month, i);
            const timecard = timecardMap[parseInt(targetDate.toFormat('yyyyMMdd'))];
            let stampedFromAt = "";
            let stampedToAt = "";
            let restTime = null;
            let actualWorkingTime = null;
            let overtime = null;
            let lateNightWorkTime = null;
            let holidayWorkTime = null;
            if (timecard) {
                stampedFromAt = timecard ? DateTime.fromJSDate(new Date(timecard.stampedFrom_at)).toFormat('HH:mm') : "";
                stampedToAt = timecard ? DateTime.fromJSDate(new Date(timecard.stampedTo_at)).toFormat('HH:mm') : "";
                restTime = timecard.rest_minutes_time;
                actualWorkingTime = timecard.actual_working_minutes_time;
                overtime = timecard.overtime;
                lateNightWorkTime = timecard.late_night_work_time;
                holidayWorkTime = timecard.holiday_work_time;
            }

            rows.push({
                id: targetDate.toFormat('yyyyMMdd'),
                date: targetDate.toFormat('MM/dd（EEE）'),
                stampedFromAt: stampedFromAt,
                stampedToAt: stampedToAt,
                restTime: restTime,
                actualWorkingTime: actualWorkingTime,
                overtime: overtime,
                lateNightWorkTime: lateNightWorkTime,
                holidayWorkTime: holidayWorkTime
            });
        }
    }
    return rows;
}

function getColumns(): readonly Column<WorkListRow, WorkListSummaryRow>[] {
    return  [
        { key: 'date', name: '日付', renderSummaryCell() {return <strong>合計</strong>;}},
        { key: 'stampedFromAt', name: '出社' },
        { key: 'stampedToAt', name: '退社' },
        { key: 'restTime', name: '休憩',
            renderCell(props) { return formatDisplayTime(props.row.restTime)},
            renderSummaryCell({ row }) {return formatDisplayTime(row.totalRestTime)}
        },
        { key: 'actualWorkingTime', name: '総労働',
            renderCell(props) { return formatDisplayTime(props.row.actualWorkingTime)},
            renderSummaryCell({ row }) {return formatDisplayTime(row.totalActualWorkingTime)}
        },
        { key: 'overtime', name: '残業',
            renderCell(props) { return formatDisplayTime(props.row.overtime)},
            renderSummaryCell({ row }) {return formatDisplayTime(row.totalOvertime)}
        },
        { key: 'lateNightWorkTime', name: '深夜労働',
            renderCell(props) { return formatDisplayTime(props.row.lateNightWorkTime)},
            renderSummaryCell({ row }) {return formatDisplayTime(row.totalLateNightWorkTime)}
        },
        { key: 'holidayWorkTime', name: '休日労働',
            renderCell(props) { return formatDisplayTime(props.row.holidayWorkTime)},
            renderSummaryCell({ row }) {return formatDisplayTime(row.totalHolidayWorkTime)}
        },
    ];
}

function _getWorkListSummaryRows(timecards : Timecard[]) : WorkListSummaryRow[] {
    let totalRestTime = 0;
    let totalActualWorkingTime = 0;
    let totalOvertime = 0;
    let totalLateNightWorkTime = 0;
    let totalHolidayWorkTime = 0;
    if (timecards.length > 0) {
        for (let timecard of timecards) {
            if (timecard.rest_minutes_time) {
                totalRestTime = totalRestTime + timecard.rest_minutes_time;
            }
            if (timecard.actual_working_minutes_time) {
                totalActualWorkingTime = totalActualWorkingTime + timecard.actual_working_minutes_time;
            }
            if (timecard.overtime) {
                totalOvertime = totalOvertime + timecard.overtime;
            }
            if (timecard.late_night_work_time) {
                totalLateNightWorkTime = totalLateNightWorkTime + timecard.late_night_work_time;
            }
            if (timecard.holiday_work_time) {
                totalHolidayWorkTime = totalHolidayWorkTime + timecard.holiday_work_time;
            }
        }
    }
    return [
        {
          id: 'total_0',
          totalRestTime: totalRestTime,
          totalActualWorkingTime: totalActualWorkingTime,
          totalOvertime: totalOvertime,
          totalLateNightWorkTime: totalLateNightWorkTime,
          totalHolidayWorkTime: totalHolidayWorkTime,
        }
    ];
}

export const config = {
    providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions
  
export const getServerSideProps = (async (context: any) => {
    const sessionData = await _getSettionData(context);
    const timecards = await GetTimecards(sessionData);
    const initRows =  _getWorkListRows(timecards);
    const initSummaryRows =  _getWorkListSummaryRows(timecards);

    return {
      props: { sessionData, initRows, initSummaryRows }
    }
}) satisfies GetServerSideProps<{ sessionData: SessionData, rows: WorkListRow[], initSummaryRows: WorkListSummaryRow[] }>

const WrappedCustomInput = forwardRef(CustumDatePicker);
const WorkList: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({sessionData, initRows, initSummaryRows}) => {
    const [rows, setRows] = useState(initRows);
    const [summaryRows, setSummaryRows] = useState(initSummaryRows);
    const [pdfData, setPdfData] = useState({});
    const gridRef = useRef<DataGridHandle>(null);
    const yearMonthRef = useRef<ReactDatePicker>(null);

    const _onChangeDatePicker = async (date: Date | null) => {
        if (date) {
            // APIのURL
            const url = process.env.NEXT_PUBLIC_SERVICE_URL_BASE + "api/_workList";
            // リクエストパラメータ
            const params = {
                method: "POST",
                // JSON形式のデータのヘッダー
                headers: {
                    "Content-Type": "application/json",
                },
                // リクエストボディ
                body: JSON.stringify({
                    fromYearMonthDay: DateTime.fromJSDate(date).startOf("month").toFormat('yyyyMMdd'),
                    toYearMonthDay: DateTime.fromJSDate(date).endOf("month").toFormat('yyyyMMdd'),
                    employeeId: sessionData.employeeId
                }),
            };
            // APIへのリクエスト
            const response = await fetch(url, params);
            const result = await response.json();

            const timecards = result.param;
            const rows = _getWorkListRows(timecards);
            const summaryRows =  _getWorkListSummaryRows(timecards);
            setRows(rows);
            setSummaryRows(summaryRows);
        }
    }
    const columns = useMemo(() => getColumns(), []);

    function onClickPDFLink() {
        setPdfData({
            yearMonth: (yearMonthRef?.current?.input as HTMLInputElement).value,
            shopName: sessionData.shopName,
            employeeName: sessionData.employeeName,
            rows:rows,
            summaryRows:summaryRows
        })
    }

    return (
        <div>
            <WrappedCustomInput
                ref={yearMonthRef}
                onChangeDatePicker={_onChangeDatePicker}
            />
            <DataGrid
                ref={gridRef}
                columns={columns}
                rows={rows}
                bottomSummaryRows={summaryRows}
            />
            <PDFDownloadLink onClick={onClickPDFLink} document={<PDF pdfData={pdfData}/>}>
                {({loading}) => (loading ? 'Loading document...' : 'クリックでPDFダウンロード')}
            </PDFDownloadLink>
        </div>
    )
}


// fileName={"勤怠表_" + ".pdf"}
//pdfData={pdfData}
export default WorkList

