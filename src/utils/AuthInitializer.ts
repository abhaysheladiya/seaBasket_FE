"use client";

import { useEffect } from "react";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearToken, setToken } from "@/src/store/slices/authSlice";
import { fetchCart } from "@/src/store/slices/cartSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (!storedToken || accessToken) return;

    let isActive = true;

    const validateToken = async () => {
      try {
        dispatch(setToken(storedToken));
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        if (isActive) {
          if (status === 401 || status === 403) {
            dispatch(clearToken());
          }
        }
      }
    };

    validateToken();

    return () => {
      isActive = false;
    };
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCart());
    }
  }, [dispatch, accessToken]);

  return null;
};

export default AuthInitializer;
