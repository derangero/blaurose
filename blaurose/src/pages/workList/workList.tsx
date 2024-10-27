import 'react-data-grid/lib/styles.css';
import { forwardRef, SetStateAction, useMemo, useRef, useState } from 'react';
import DataGrid, { Column, DataGridHandle } from 'react-data-grid';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession, NextAuthOptions } from 'next-auth';
import authOptions from "../api/auth/[...nextauth]"
import { DateTime } from 'luxon';
import { CustumDatePicker } from '@/components/date/CustumDatePicker';
import { formatDisplayTime } from '@/components/util/commonUtil'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { MDBBtn } from 'mdb-react-ui-kit';
import { SessionData, Timecard } from '@/types';
import { WorkListRow,WorkListSummaryRow } from '@/models/workList/workListModels';
import { GetTimecardsFromSession } from '@/services/workList/workListService';
import download from 'downloadjs'
import { toast } from 'react-toastify';

export const config = {
    providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions
  
export const getServerSideProps = (async (context: any) => {
    const sessionData = await _getSettionData(context);
    const timecards = await GetTimecardsFromSession(sessionData);
    const initRows =  getWorkListRows(DateTime.now().endOf("month"), timecards);
    const initSummaryRows =  getWorkListSummaryRows(timecards);

    return {
      props: { sessionData, initRows, initSummaryRows }
    }
}) satisfies GetServerSideProps<{ sessionData: SessionData, rows: WorkListRow[], initSummaryRows: WorkListSummaryRow[] }>


const WorkList: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({sessionData, initRows, initSummaryRows}) => {
    const [rows, setRows] = useState(initRows);
    const [summaryRows, setSummaryRows] = useState(initSummaryRows);
    const gridRef = useRef<DataGridHandle>(null);
    const yearMonthRef = useRef<ReactDatePicker>(null);
    const WrappedCustomInput = forwardRef(CustumDatePicker);
    
    const _onChangeDatePicker = async (date: Date | null) => {
        if (date) {
            const axios = require('axios');
            const fromYearMonthDay = DateTime.fromJSDate(date).startOf("month").toFormat('yyyyMMdd');
            const toYearMonthDay = DateTime.fromJSDate(date).endOf("month").toFormat('yyyyMMdd');
            await axios.get("/api/workList/getTimecards", {
                    params: {
                        fromYearMonthDay: fromYearMonthDay,
                        toYearMonthDay: toYearMonthDay,
                        employeeId: sessionData.employeeId,
                    },
                }
            ).then((response: { data: { param: any; }; })=>{
                const timecards = response.data ? response.data.param : null;
                const rows = getWorkListRows(DateTime.fromJSDate(date).endOf("month"), timecards);
                const summaryRows =  getWorkListSummaryRows(timecards);
                setRows(rows);
                setSummaryRows(summaryRows);
            }).catch((error: string) => {
                console.log(error);
            });
        }
    }
    const columns = useMemo(() => getColumns(), []);

    async function onClickPdfButton() {
        await require('axios').get("/api/workList/exportPdf", {
            responseType: 'blob', // had to add this one here
                params: {
                    fromYearMonthDay: DateTime.fromJSDate(yearMonthRef?.current?.props.selected).startOf("month").toFormat('yyyyMMdd'),
                    toYearMonthDay: DateTime.fromJSDate(yearMonthRef?.current?.props.selected).endOf("month").toFormat('yyyyMMdd'),
                    yearMonthDay: DateTime.fromJSDate(yearMonthRef?.current?.props.selected).toFormat('yyyy年MM月'),
                    employeeId: sessionData.employeeId,
                    employeeName: sessionData.employeeName,
                    shopName: sessionData.shopName,
                },
            }
        ).then((response)=>{
            const pdfFileName = decodeURIComponent(response.headers['content-disposition'].replace('filename=',''))
            download(response.data, pdfFileName, response.headers['content-type']);
            //window.open(URL.createObjectURL(response.data));
            toast.success('PDF出力を行いました');
        }).catch((error: string) => {
            console.log(error);
        });
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
            <div>
                <MDBBtn className="mt-3 mb-3 vw-25" color='info' type="submit" onClick={onClickPdfButton}>PDF出力</MDBBtn>
            </div>
        </div>
    )
}

async function _getSettionData(context: any) : Promise<SessionData> {
    const session = await getServerSession(context.req, context.res, config);

    return {
        shopCode: session?.user.name.employee.shop.shop_code,
        shopName: session?.user.name.employee.shop.shop_name,
        employeeName: session?.user.name.employee.employee_name,
        employeeId: session?.user.name.employee.employee_id,
   }
}

export function getWorkListRows(endOfMonthDate: DateTime, timecards : Timecard[]) {
    const rows: WorkListRow[] = [];
    let timecardMap = null
    if (timecards.length > 0) {
        timecardMap = timecards.reduce((p: Timecard, c: { stamped_on: number; }
        ) => Object.defineProperty(p, c.stamped_on, { value: c }), {}); 
    }
    for (let i = 1; i < parseInt(endOfMonthDate.toFormat('dd')) + 1; i++) {
        const targetDate = DateTime.local(endOfMonthDate.year, endOfMonthDate.month, i);
        const timecard = timecardMap ? timecardMap[parseInt(targetDate.toFormat('yyyyMMdd'))] : null;
        let stampedFromAt = "";
        let stampedToAt = "";
        let restTime = null;
        let actualWorkingTime = null;
        let overtime = null;
        let lateNightWorkTime = null;
        let holidayWorkTime = null;
        if (timecard) {
            stampedFromAt = timecard.stampedFrom_at ? DateTime.fromJSDate(new Date(timecard.stampedFrom_at)).toFormat('HH:mm') : "";
            stampedToAt = timecard.stampedTo_at ? DateTime.fromJSDate(new Date(timecard.stampedTo_at)).toFormat('HH:mm') : "";
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

export function getWorkListSummaryRows(timecards : Timecard[]) : WorkListSummaryRow[] {
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

export default WorkList

