import "@/styles/globals.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "./header/header";
import SubPageFooter from "./footer/subPageFooter";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const isDisplayHeader = Component.displayName  !== "Login";
  const isDisplaySubFooter = Component.displayName  !== "Login" && Component.displayName  !== "Main";
  return (
    <SessionProvider session={session}>
        {isDisplayHeader && <Header />}
        <Component {...pageProps} />
        {isDisplaySubFooter && <SubPageFooter />}
    </SessionProvider>
  );
}

export default MyApp;
//export default dynamic(() => Promise.resolve(MyApp), { ssr: false });