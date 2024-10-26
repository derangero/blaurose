export interface WorkListRow {
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

export interface WorkListSummaryRow {
    id?: string,
    totalRestTime?:   number,
    totalActualWorkingTime?:   number,
    totalOvertime?:   number,
    totalLateNightWorkTime?:   number,
    totalHolidayWorkTime?:   number,
}

export interface WorkListPdfParam {
    pdfData?: WorkListPdf
}

export interface WorkListPdf {
    title?: string,
    yearMonth?: string,
    shopName: string,
    employeeName: string,
    rows:WorkListRow[],
    summaryRows:WorkListSummaryRow[]
}