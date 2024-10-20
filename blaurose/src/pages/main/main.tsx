import React, { useEffect, useRef, useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import type { NextAuthOptions } from "next-auth"
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import authOptions from "../api/auth/[...nextauth]"
import { DateTime,Settings } from "luxon";
import { MDBBtn, MDBCol } from 'mdb-react-ui-kit';
import { FindByStampedOnAndEmployeeId, FindPreviousByStampedOnAndEmployeeId, UpdateByStampedOnAndEmployeeId, UpsertByStampedOnAndEmployeeId } from '../../../prisma/timecard/dba_timecard'
import { SessionData } from '@/types';

export const config = {
  providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions

export const getServerSideProps = (async (context: any) => {
  const session = await getServerSession(context.req, context.res, config)
  //Settings.defaultLocale = 'ja';
  const nowDate = DateTime.now();
  
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
  let timecard = await FindPreviousByStampedOnAndEmployeeId(nowDate.minus({days: 1}).toFormat('yyyyMMdd'), employeeId);
  if (timecard) {
    sessionData.stampedByPreviousMark = "（前日）";
  } else {
    timecard = await FindByStampedOnAndEmployeeId(nowDate.toFormat('yyyyMMdd'), employeeId);
  }

  if (timecard) {
    if (timecard.stampedFrom_at) {
      sessionData.stampedFromAt = DateTime.fromJSDate(timecard.stampedFrom_at).toFormat('HH:mm');
    } else {
      //none
    }
    if (timecard.stampedTo_at) {
      sessionData.stampedToAt = DateTime.fromJSDate(timecard.stampedTo_at).toFormat('HH:mm');
    } else {
      //none
    }
  } else {
    //none
  }

  return {
    props: { sessionData }
  }
}) satisfies GetServerSideProps<{ sessionData: SessionData }>

export default function Main({
  sessionData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [postError, setPostError] = useState("");
  const [stampedFromAt, setStampedFromAt] = useState(sessionData.stampedFromAt);
  const [stampedToAt, setStampedToAt] = useState(sessionData.stampedToAt);
  const [stampedByPreviousMark, setStampedByPreviousMark] = useState(sessionData.stampedByPreviousMark);
  const displayDate = DateTime.local().toFormat('yyyy/M/d（EEE）');
  const displayTime = DateTime.local().toFormat('HH:mm');
  const [date, setDate] = useState([])
  const [time, setTime] = useState([])

  useEffect(() => {
      setInterval(() => {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let dayofweek = d.getDay();

      const dayname = ['日','月','火','水','木','金','土'];

      setDate(year + '年' + month + '月' + day + '日' + '（' + dayname[dayofweek] + '）');

      let hour = d.getHours().toString().padStart(2, '0');
      let minute = d.getMinutes().toString().padStart(2, '0');
      setTime(hour + ':' + minute);
      });

  },[])

  const submitHandler = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/_stamping", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        })
    });

    //api側のレスポンスを受け取る
    const data = await res.json();
    if(data) {
      setStampedFromAt(data.param.stampedFromAt);
      setStampedToAt(data.param.stampedToAt);
      if (data.param.stampedByPreviousMark) {
        setStampedByPreviousMark("（本日）");
      } else {
        // none
      }
    }else{
        setPostError(data.message);
    }
};
  return (
    <main>
      <div className="d-flex align-items-start bg-body-tertiary mb-3 ml-5 mt-3" style={{ height: "100px" }}>
        <MDBCol className='fs-5 mr-5'>
        <div className='card'>
          <div className='card-body'>
            <div>{date}</div>
            <div>{time}</div>
            <div>
              <form onSubmit={submitHandler}>
                <div>
                  <MDBBtn className="mt-3 mb-3 w-50" color='info' size='lg' type="submit">打刻する</MDBBtn>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div>
          <button className="mt-5 ml-5 fs-5" onClick={() => signOut()}>サインアウト</button>
        </div>
        </MDBCol>
        <MDBCol className='fs-5 mr-5'>
        <div className='card '>
          <div className='card-body'>
            <div>{postError && "サインイン失敗"}</div>
            <div>開始時刻：{stampedFromAt}  {stampedByPreviousMark}</div>
            <div>終了時刻：{stampedToAt}</div>
          </div>
        </div>
        </MDBCol>
        <MDBCol className="mr-5">
        <div className='card '>
          <div className='card-body'>
            <div>店舗コード：{sessionData.shopCode}</div>
            <div>店舗名：{sessionData.shopName}</div>
            <div>氏名：{sessionData.employeeName}</div>
          </div>
        </div>
        </MDBCol>
      </div>
    </main>
  )
}
Main.displayName = "Main"
//export default Main;
//export default dynamic(() => Promise.resolve(Main), { ssr: false });

