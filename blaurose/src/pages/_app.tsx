import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth';
import { SessionData } from '@/types';
import Header from "@/components/header/header";
import SubPageFooter from "@/components/footer/subPageFooter";
import { ToastContainer } from 'react-toastify';
import "@/styles/main/main.css";
import "@/styles/header/header.css";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session, sessionData: SessionData }>) {
  const isDisplayHeader = Component.displayName  !== "Login";
  const isDisplaySubFooter = Component.displayName  !== "Login" && Component.displayName  !== "Main";

  return (
    <SessionProvider session={session} >
        {isDisplayHeader && <Header sessionData={pageProps.sessionData}/>}
        <Component {...pageProps} />
        <ToastContainer 
          position="bottom-left"
        />
        {isDisplaySubFooter && <SubPageFooter />}
    </SessionProvider>
  );
}

export default App;
//export default dynamic(() => Promise.resolve(MyApp), { ssr: false });