"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/src/layout/BrandLogo";
import { verifyOtp, resendOtp, clearTempToken } from "@/src/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { syncGuestCart } from "@/src/helper/syncCart";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const otpSchema = z.object({
  otp: z
    .number()
    .int("OTP must be a number")
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;
const Verification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading, error, success } = useAppSelector((state) => state.auth.verifyOtp);
  const {
    error: resendError,
    message: resendMessage,
    isLoading: isSubmitting,
  } = useAppSelector((state) => state.auth.resendOtp);
  const { tempToken, accessToken, user } = useAppSelector((state) => state.auth);
  const email = user?.email ?? "";
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    if (success && accessToken) {
      void syncGuestCart(accessToken, dispatch);
      router.push(redirectTo || "/");
      return;
    }

    if (!tempToken) {
      router.push("/login");
    }
  }, [success, accessToken, tempToken, router, redirectTo, dispatch]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });
  if (!tempToken) return null;

  const onSubmit = (data: OtpFormData) => {
    if (!email) {
      router.push("/login");
      return;
    }
    dispatch(verifyOtp({ tempToken, otp: Number(data.otp) }));
  };

  const handleResendOtp = () => {
    if (!tempToken) {
      router.push("/login");
      return;
    }

    dispatch(resendOtp({ tempToken }));
  };

  const handleChangeEmail = () => {
    dispatch(clearTempToken());
    router.replace("/login");
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white/85 shadow-xl"
      >
        <div className="flex justify-center bg-gray-500 px-5 py-4">
          <BrandLogo variant="inverse" />
        </div>

        <div className="bg-gray-500 py-3">
          <h1 className="text-center text-xl font-semibold text-white">OTP Verification</h1>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-center text-sm text-neutral-600">
            Enter the 6-digit code sent to
            <span className="block font-semibold text-gray-600 mt-1">
              {email || "your email"}
            </span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-semibold text-neutral-700">
                Enter OTP <span className="text-red-500">*</span>
              </label>

              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                {...register("otp", {
                  setValueAs: (v) => (v ? Number(String(v).replace(/\D/g, "")) : undefined),
                })}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 6);
                }}
                className="h-11 w-full rounded-md border border-neutral-300 px-3 text-center text-base text-neutral-800 outline-none transition-colors focus:border-gray-500 mt-2"
              />
            </div>

            {errors.otp && <p className="text-xs text-red-600 text-center">{errors.otp.message}</p>}

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {resendMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-700"
                >
                  {resendMessage}
                </motion.p>
              )}
              {resendError && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
                >
                  {resendError}
                </motion.p>
              )}
            </AnimatePresence>
            <Button
              type="button"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer"
            >
              {isSubmitting ? "Resending OTP" : "Resend OTP"}
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full bg-gray-500 text-white font-semibold hover:bg-gray-600 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              onClick={handleChangeEmail}
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-800 cursor-pointer"
            >
              Use a different email
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Verification;