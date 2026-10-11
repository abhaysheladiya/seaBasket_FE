"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import BrandLogo from "@/src/layout/BrandLogo";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { resetPassword } from "@/src/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const resetSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const { isLoading, success } = useAppSelector((state) => state.auth.resetPassword);

  useEffect(() => {
    if (success) {
      router.push("/login");
      return;
    }
  }, [router, success]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  if (!token) return null;
  const onSubmit = (data: ResetFormData) => {
    if (!token) return;
    dispatch(
      resetPassword({
        password: data.password,
        token,
      }),
    );
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-120 rounded-2xl bg-white/85 shadow-xl"
      >
        <div className="flex justify-center bg-gray-500 px-5 py-4 rounded-t-2xl">
          <BrandLogo variant="inverse" />
        </div>

        <div className="bg-gray-500 py-3">
          <h1 className="text-center text-2xl font-semibold text-white">Reset Password</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-semibold">
                New Password <span className="text-red-500">*</span>
              </label>

              <Input
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                className="mt-2 h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-500 outline-none"
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <Input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="mt-2 h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-500 outline-none"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-35 bg-gray-500 text-white font-semibold hover:bg-gray-600 disabled:opacity-70"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ResetPasswordForm;