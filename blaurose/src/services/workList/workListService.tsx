import { DateTime } from "luxon";
import { ListByStampedOnAndEmployeeId } from "@/repositories/timecard/dba_timecard";
import { SessionData, Timecard } from "@/types";
import { NextApiRequest } from "next";
import { getWorkListRows, getWorkListSummaryRows } from "@/pages/workList/workList";
import ReactPDF from "@react-pdf/renderer";
import PDF from "@/components/pdf/PDF";
import { WorkListPdf, WorkListPdfParam } from "@/models/workList/workListModels";

export async function GetTimecardsFromSession(sessionData : SessionData) : Promise<Timecard[]> {
    const nowDate = DateTime.now();
    const fromYearMonthDay = nowDate.startOf('month');
    const toYearMonthDay = nowDate.endOf('month');

    const timecards = await GetTimecardsFromParam(
        fromYearMonthDay.toFormat('yyyyMMdd'),
        toYearMonthDay.toFormat('yyyyMMdd'),
        sessionData.employeeId);
    return timecards;
}

export async function GetTimecardsFromParam(fromYearMonthDay?: string, toYearMonthDay?: string, employeeId? :string) : Promise<Timecard[]> {
    if (fromYearMonthDay == null || toYearMonthDay == null || employeeId == null) {
        return [];
    }

    const timecards = await ListByStampedOnAndEmployeeId(
        fromYearMonthDay,
        toYearMonthDay,
        employeeId
    );

    return timecards;
}

export async function getWorkListPdf(_req: NextApiRequest, pdfFileName: string, date: DateTime ) {
    if (!_req.query.fromYearMonthDay){
        return null;
    };
    const fromYearMonthDay = _req.query.fromYearMonthDay as string;
    const toYearMonthDay = _req.query.toYearMonthDay as string;
    const employeeId = _req.query.employeeId as string;
    const timecards = await GetTimecardsFromParam(
      fromYearMonthDay,
      toYearMonthDay,
      employeeId);
  
      const pdfData = {
          title: pdfFileName,
          yearMonth: _req.query.yearMonthDay,
          shopName: _req.query.shopName,
          employeeName: _req.query.employeeName,
          rows:getWorkListRows(date.endOf("month"), timecards),
          summaryRows:getWorkListSummaryRows(timecards)
      } as  WorkListPdf;
    const pdfStream = await ReactPDF.renderToStream(<PDF pdfData={pdfData}/>);
    return pdfStream;
  }