import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import Loader from "@/components/Loader";

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const authData = useStore((state) => state.auth);
  const removeAuth = useStore((state) => state.removeAuth);
  const hasHydrated = useStore((state) => state.hasHydrated);

  const publicRoutes = ["/login", "/", "/faq", "/review", "/404"];
  

  const isPublicRoute = publicRoutes.includes(router.pathname) || router.pathname.startsWith("/products/") || router.pathname.startsWith("/review/");
  const isAuthorized =
    isPublicRoute || (authData?.isLoggedIn && authData?.username);


  useEffect(() => {
    if (!router.isReady || !hasHydrated) return;

    if (!isAuthorized) {
      localStorage.removeItem("auth");
      removeAuth();
      router.replace("/login");
    }
  }, [router.isReady, isAuthorized, hasHydrated]);

  if (!hasHydrated) {
    return <Loader />;
  }

  if (!isAuthorized) {
    return <Loader />;
  }

  return children;
};

export default ProtectRoute;