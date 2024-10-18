import "@/styles/globals.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header/Header";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const isFromLoginPage = Component.name == "Login";
  return (
    <SessionProvider session={session}>
        {!isFromLoginPage && <Header />}
        <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
//export default dynamic(() => Promise.resolve(MyApp), { ssr: false });