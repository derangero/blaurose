import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { userDataState } from "../../recoil/userData"
import Login from '../login/login';
import { getServerSession } from 'next-auth';
import authOptions from "../api/auth/[...nextauth]"


// 最初に処理
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      session,
    },
  }
}

const Main: React.FC = (param) => {
  
  // セッションストレージにリコイルデータが無ければ、ログイン画面へ遷移
  //sessionStorage.getItem("recoil-persist") != null ? <Header /> : <Login />
  debugger;
  return (
    <div>test</div>
  );
};


export default Main;
//export default dynamic(() => Promise.resolve(Main), { ssr: false });

