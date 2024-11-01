import { DateTime } from 'luxon';
import PDF from '@/components/pdf/PDF';
import ReactPDF from "@react-pdf/renderer";
import type { NextApiRequest, NextApiResponse } from "next";
import { GetTimecardsFromParam } from '@/services/workList/workListService';
import { getWorkListRows, getWorkListSummaryRows } from '../../workList/workList';
import { WorkListPdf } from '@/models/workList/workListModels';

export default async function exportPdf(
  _req: NextApiRequest,
  res: NextApiResponse<never>
) {
  const fromYearMonthDay = _req.query.fromYearMonthDay as string;
  const toYearMonthDay = _req.query.toYearMonthDay as string;
  const employeeId = _req.query.employeeId as string;
  const timecards = await GetTimecardsFromParam(
    fromYearMonthDay,
    toYearMonthDay,
    employeeId
  );

  const now = DateTime.now();
  const pdfFileName = "勤怠表_" + _req.query.employeeName + "_" + now.toFormat("yyyyMMddHHmmss") + ".pdf";
  const endOfMonthDay = DateTime.fromFormat(toYearMonthDay,'yyyyMMdd');
  const pdfData = {
      title: pdfFileName,
      yearMonth: _req.query.yearMonthDay,
      shopName: _req.query.shopName,
      employeeName: _req.query.employeeName,
      rows:getWorkListRows(endOfMonthDay, timecards),
      summaryRows:getWorkListSummaryRows(timecards)
  } as WorkListPdf;
  
  const pdfStream = await ReactPDF.renderToStream(<PDF pdfData={pdfData}/>);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'filename='+ encodeURIComponent(pdfFileName)
  );
  pdfStream.pipe(res);
  pdfStream.on('end', () => console.log('Done streaming, response sent.'));
}