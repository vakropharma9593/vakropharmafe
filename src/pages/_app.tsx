import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "./index.css";
import ProtectRoute from "../lib/protectRoute";
import { ToastContainer, Bounce } from "react-toastify";
import RouteTransition from "@/components/RouteTransition";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <>
      <RouteTransition />
      <ProtectRoute>
        <Component {...pageProps} />
      </ProtectRoute>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
    </>
  </>;
}
