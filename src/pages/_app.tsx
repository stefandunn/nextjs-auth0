import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { AuthWrapper } from "../components/AuthWrapper";

function MyApp({ Component, pageProps }: AppProps) {
  const guestRoutes = ["/signup/"];

  return (
    <RecoilRoot>
      <UserProvider>
        <AuthWrapper
          guestRoutes={guestRoutes}
          redirectIfAuthedRoutes={guestRoutes}
        >
          <Component {...pageProps} />
        </AuthWrapper>
      </UserProvider>
    </RecoilRoot>
  );
}

export default MyApp;
