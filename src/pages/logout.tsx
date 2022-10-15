import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/api/auth/logout");
  }, [router]);

  return null;
};

export default Logout;
