import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "./index.css";
import ContextProvider from "@/store/context";
import ProtectRoute from "../lib/protectRoute";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <ContextProvider>
      <ProtectRoute>
        <Component {...pageProps} />
      </ProtectRoute>
    </ContextProvider>
  </>;
}
