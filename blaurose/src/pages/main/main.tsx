import React, { useEffect, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { DateTime,Settings } from "luxon";
import { MDBBtn, MDBCol } from 'mdb-react-ui-kit';
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, findWorkingDataByStampedOnAndEmployeeId } from '@/repositories/timecard/dba_timecard'
import { getServerSessionData } from '@/utils/session/sessionUtil';
import { MDBBtnColor } from '@/types';
import { isNullOrEmpty } from '@/utils/common/commonUtil';
import { toast } from 'react-toastify';

export const getServerSideProps = (async (context: any) => {
  const sessionData = await getServerSessionData(context);
  const today = DateTime.now();
  let timecard = await FindByStampedOnAndEmployeeId(
      today.toFormat('yyyyMMdd'),
      sessionData.employeeId
  )
  // 前日分の日跨ぎ打刻用にタイムカード取得
  if (!timecard){
      timecard = await findWorkingDataByStampedOnAndEmployeeId(
          today.minus({days:1}).toFormat('yyyyMMdd'),
          sessionData.employeeId
      )
  }
  let initWorkStateMsg = "";
  if (timecard) {
    if (timecard.work_start_at && !timecard.work_end_at) {
      initWorkStateMsg = "勤務中";
    }
    if (timecard.rest_start_at && !timecard.rest_end_at) {
      initWorkStateMsg = "休憩中";
    }
    if (timecard.work_end_at) {
      initWorkStateMsg = "勤務終了";
    }
  }
  return {
    props: { sessionData, initWorkStateMsg }
  }
})
// satisfies GetServerSideProps<{ sessionData: SessionData }>

function Main({
  sessionData, initWorkStateMsg
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // サーバーサイドで取得（CSRにしない）
  // const { data: session, status } = useSession()
  const nowDate = DateTime.now();
  const [workStateMsg, setWorkStateMsg] = useState(initWorkStateMsg);

  //suppressHydrationWarning ※SSRで乗り切る
  const [date, setDate] = useState(nowDate.toFormat("yyyy年MM月dd日(EEE)"))
  const [hourMinutesTime, setHourMinutesTime] = useState(nowDate.toFormat("HH:mm"))
  const [secondTime, setSecondTime] = useState(nowDate.toFormat("ss"))

  useEffect(() => {
      setInterval(() => {
        const nowDate = DateTime.now();
        setDate(nowDate.toFormat("yyyy年MM月dd日(EEE)"));
        setHourMinutesTime(nowDate.toFormat("HH:mm"));
        setSecondTime(nowDate.toFormat("ss"))
      });
  },[])

  const submitHandler = async (e: { nativeEvent: any; preventDefault: () => void; }) => {
    e.preventDefault();
    const uri = e.nativeEvent.submitter.name;
    await require('axios').post(process.env.NEXT_PUBLIC_SERVICE_URL_BASE + "api/main/" + uri, {
        params: {
        },
      }
    ).then((response: { data: any; })=>{
      const errorMsg = response.data;
      if(!errorMsg) {
        switch (uri) {
          case 'startWork':
            setWorkStateMsg('勤務中');
            toast.success('勤務開始しました。');
            break;
          case 'endWork':
            setWorkStateMsg('勤務終了');
            toast.success('勤務終了しました。');
            break;
          case 'startRest':
            setWorkStateMsg('休憩中');
            toast.success('休憩開始しました。');
            break;
          case 'endRest':
            setWorkStateMsg('勤務中');
            toast.success('休憩終了しました。');
            break;
          default:
            break;
        }
      } else {
        toast.error(errorMsg);
      }
    }).catch((error: string) => {
        console.log(error);
    });
  };

  return (
    <main>
      <div className="align-items-start bg-body-tertiary mb-3 ml-5 mt-3 main-custom-grid">
          <div className='card h-100 mr-5'>
            <div className='card-body'>
              <div suppressHydrationWarning>{date}</div>
              <div className="">
                <span className="main-hourMinutesTime" suppressHydrationWarning>{hourMinutesTime}</span>
                <span className="main-secondTime" suppressHydrationWarning>&nbsp;{secondTime}</span>
              </div>
              <div>{workStateMsg}</div>
              <div>
                <form onSubmit={submitHandler}>
                  <div>
                    <div className="inline-block mr-3">
                      <MDBBtn className="mt-3 mb-3 vw-50" color='info' size='lg' type="submit"
                        name="startWork">出勤　　</MDBBtn>
                    </div>
                    <div className="inline-block">
                      <MDBBtn className="mt-3 mb-3 vw-50" color='info' size='lg' type="submit"
                        name="endWork">退勤　　</MDBBtn>
                    </div>
                  </div>
                  <div>
                    <div className="inline-block mr-3">
                      <MDBBtn className="vw-50" color='info' size='lg' type="submit"
                        name="startRest">休憩開始</MDBBtn>
                    </div>
                    <div className="inline-block">
                      <MDBBtn className="vw-50" color='info' size='lg' type="submit"
                        name="endRest">休憩終了</MDBBtn>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </div>
    </main>
  )
}
Main.displayName = "Main"
export default Main;
//export default dynamic(() => Promise.resolve(Main), { ssr: false });


{/* <div className='card h-100 mr-5'>
<div className='card-body'>
  <div>店舗コード：{sessionData.shopCode}</div>
  <div>店舗名：{sessionData.shopName}</div>
  <div>氏名：{sessionData.employeeName}</div>
  <div>
    <MDBBtn className="mt-5 vw-50" color='secondary' onClick={() => signOut()}>ログアウト</MDBBtn>
  </div>
</div>
</div> */}
