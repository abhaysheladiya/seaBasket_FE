"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hooks";

export const useAuthGuard = () => {
  const router = useRouter();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  return { accessToken };
};
