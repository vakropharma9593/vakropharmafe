import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { Context } from "../store/context";
import ACTIONS from "../store/actions";

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Context);

  const publicRoutes = ["/login", "/", "/products/facewash", "/products/facemoisturizer" , "/products/faceserum", "/products/sunscreen", "/faq"];

  const isPublicRoute = publicRoutes.includes(router.pathname);
  const isAuthorized =
    isPublicRoute || (state?.auth?.isLoggedIn && state?.auth?.username);

  useEffect(() => {
    if (!router.isReady) return;

    if (!isAuthorized) {
      localStorage.removeItem("auth");
      dispatch({ type: ACTIONS.REMOVE_AUTH });
      console.info("going back to login", router.isReady, state?.auth?.isLoggedIn, state?.auth);
      router.replace("/login");
    }
  }, [router.isReady, isAuthorized]);

  if (!isAuthorized) return null;

  return children;
};

export default ProtectRoute;