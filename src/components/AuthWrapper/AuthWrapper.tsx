import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { UserState } from "../../global-states/auth.state";
import { Timeout } from "../../types/window.types";
import { AuthWrapperProps } from "./AuthWrapper.types";
import globMatch from "wildcard-match";
import { useUser } from "@auth0/nextjs-auth0";

const AuthWrapper: FC<AuthWrapperProps> = ({
  children,
  guestRoutes = [],
  redirectIfAuthedRoutes = [],
}) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const timeout = useRef<Timeout>(null);
  const setUser = useSetRecoilState(UserState);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const belongsInRoute = (routes: string[]) => {
    let matchedRoute = false;
    const path = router.asPath;
    routes.forEach((route) => {
      const routeMatch = globMatch(route);
      if (routeMatch(path) || path === route) {
        matchedRoute = true;
      }
    });

    return matchedRoute;
  };
  const isGuestRoute = belongsInRoute(guestRoutes);
  const isRedirectIfAuthedRoute = belongsInRoute(redirectIfAuthedRoutes);

  const shouldRedirectBackBasedOnAuth =
    isRedirectIfAuthedRoute && !isLoading && user;
  const shouldRedirectAsGuest = !isGuestRoute && !isLoading && !user;

  useEffect(() => {
    let mounted = true;
    const authCheck = async () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (shouldRedirectBackBasedOnAuth || shouldRedirectAsGuest) {
        if (shouldRedirectBackBasedOnAuth) {
          router.replace("/");
        }
        if (shouldRedirectAsGuest) {
          await router.replace("/api/auth/login");
        }
      }
    };

    authCheck();

    return () => {
      mounted = false;
    };
  }, [router, shouldRedirectBackBasedOnAuth, shouldRedirectAsGuest]);

  if (isLoading || (!isGuestRoute && !user)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
