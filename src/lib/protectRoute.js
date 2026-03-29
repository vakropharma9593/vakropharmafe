import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { Context } from "../store/context";
import ACTIONS from "../store/actions";

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { state, dispatch, isAuthenticated } = useContext(Context);

  const publicRoutes = ["/login", "/", "/products/facewash", "/products/facemoisturizer" , "/products/faceserum", "/products/sunscreen", "/faq"];

  const isPublicRoute = publicRoutes.includes(router.pathname);
  const isAuthorized =
    isPublicRoute || (isAuthenticated && state?.auth?.username);

  useEffect(() => {
    if (!router.isReady) return;

    if (!isAuthorized) {
      dispatch({ type: ACTIONS.REMOVE_AUTH });
      console.info("going back to login", router.isReady, isAuthenticated, router.pathname);
      router.replace("/login");
    }
  }, [router.isReady, isAuthorized]);

  if (!isAuthorized) return null;

  return children;
};

export default ProtectRoute;