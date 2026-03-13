import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { Context } from "../store/context";
import ACTIONS from "../store/actions";

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { state, dispatch, isAuthenticated } = useContext(Context);

  const publicRoutes = ["/login", "/"];

  const isPublicRoute = publicRoutes.includes(router.pathname);
  const isAuthorized =
    isPublicRoute || (isAuthenticated && state?.auth?.username);

  useEffect(() => {
    if (!router.isReady) return;

    if (!isAuthorized) {
      dispatch({ type: ACTIONS.REMOVE_AUTH });
      router.replace("/login");
    }
  }, [router.isReady, isAuthorized]);

  if (!isAuthorized) return null;

  return children;
};

export default ProtectRoute;