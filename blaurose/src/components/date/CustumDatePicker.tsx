import { SetStateAction, useState } from "react";
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css"
import 'bootstrap/dist/css/bootstrap.min.css'
//import '../../styles/datePicker/style.scss'

//日本語化
registerLocale("ja", ja);

export const CustumDatePicker = (props: { onChangeDatePicker: (arg0: Date) => void; }, ref: any)  => {
  const [startDate, setStartDate] = useState(new Date());

  const onChangeDatePicker = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      props.onChangeDatePicker(date);
    }
  }

  return (
    <>
      <div className="inline-block mx-3 my-3">
        年月
      </div>
      <div className="inline-block mx-3 my-3">
          <ReactDatePicker
            ref={ref} 
            locale="ja"
            selected={startDate}
            onChange={(date) => onChangeDatePicker(date)}
            dateFormat="yyyy年M月"
            showMonthYearPicker />
      </div>
    </>
  );
};

