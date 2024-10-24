import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { formatDisplayTime } from "../util";

Font.register({
  family: "NotoSansJP-Regular",
  src: "../../fonts/NotoSansJP-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 9,
    fontFamily: "NotoSansJP-Regular",
  },
  header: {
    fontSize: 14,
    marginBottom: 0,
    fontWeight: "bold",
  },
  details: {
    marginBottom: 5,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemsTable: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontWeight: "bold",
    padding: 2,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    height: "20px!important",

  },
  tableCol: {
    width: "12.5%",
    height: "20px!important",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  textVertical: {
    flexDirection: "column",
  },
});

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
type PDFParam = {
  pdfData?: PDFData,
}
type PDFData = {
  yearMonth?: string,
  shopName: string,
  employeeName: string,
  rows:WorkListRow[],
  summaryRows:WorkListSummaryRow[]
}
const workListdata = [
  {
    title: "発注日",
    value: "2024/4/01",
    items: [
      {
        name: "サンプル1",
        surface: "1",
        thickness: "式",
        width: "10,000",
        length: "10,000",
      },
    ],
  },
];
export default function PDF(props : PDFParam) {
  debugger;
  const pdfData = props.pdfData as PDFData
  if (Object.keys(pdfData).length === 0) {
    return (
        <Document>
        </Document>
    )
  }
  return (
    <Document title='My PDF'>
      <Page style={styles.page} size="A4">
        <View>
          <Text style={styles.header}>出勤簿</Text>
        </View>
        <View style={styles.details}>
            <View style={styles.detailItem}>
              <View style={styles.textVertical}>
                <Text>{pdfData.yearMonth}&emsp;{pdfData.shopName}&emsp;{pdfData.employeeName}</Text>
              </View>
            </View>
        </View>
        <View style={styles.itemsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>日付</Text>
            <Text style={styles.tableColHeader}>出社</Text>
            <Text style={styles.tableColHeader}>退社</Text>
            <Text style={styles.tableColHeader}>休憩</Text>
            <Text style={styles.tableColHeader}>総労働</Text>
            <Text style={styles.tableColHeader}>残業</Text>
            <Text style={styles.tableColHeader}>深夜労働</Text>
            <Text style={styles.tableColHeader}>休日労働</Text>
          </View>
          {pdfData.rows.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.date}</Text>
              <Text style={styles.tableCol}>{item.stampedFromAt}</Text>
              <Text style={styles.tableCol}>{item.stampedToAt}</Text>
              <Text style={styles.tableCol}>{formatDisplayTime(item.restTime)}</Text>
              <Text style={styles.tableCol}>{formatDisplayTime(item.actualWorkingTime)}</Text>
              <Text style={styles.tableCol}>{formatDisplayTime(item.overtime)}</Text>
              <Text style={styles.tableCol}>{formatDisplayTime(item.lateNightWorkTime)}</Text>
              <Text style={styles.tableCol}>{formatDisplayTime(item.holidayWorkTime)}</Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>合計</Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}>{formatDisplayTime(pdfData.summaryRows[0].totalRestTime)}</Text>
            <Text style={styles.tableCol}>{formatDisplayTime(pdfData.summaryRows[0].totalActualWorkingTime)}</Text>
            <Text style={styles.tableCol}>{formatDisplayTime(pdfData.summaryRows[0].totalOvertime)}</Text>
            <Text style={styles.tableCol}>{formatDisplayTime(pdfData.summaryRows[0].totalLateNightWorkTime)}</Text>
            <Text style={styles.tableCol}>{formatDisplayTime(pdfData.summaryRows[0].totalHolidayWorkTime)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}