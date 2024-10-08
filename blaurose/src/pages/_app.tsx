import "@/styles/globals.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import authOptions from "./api/auth/[...nextauth]"

import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import Login from "./login/login";
import dynamic from "next/dynamic";
import { userDataState } from "@/recoil/userData";
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth";

function MyApp({ Component, pageProps } : AppProps) {
  return (
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
  );

  const hasSession = sessionStorage.getItem("recoil-persist") != null;
  if (Component.name == "Login" || !hasSession) {
    return (
      <RecoilRoot>
        <Login {...pageProps} />
      </RecoilRoot>
    );
  }

  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;

//export default dynamic(() => Promise.resolve(MyApp), { ssr: false });