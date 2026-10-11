"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/src/layout/BrandLogo";
import { loginUser } from "@/src/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.auth.login);
  const { message: resetMessage } = useAppSelector((state) => state.auth.resetPassword);
  const redirectTo = searchParams.get("redirect");
  const { tempToken, accessToken } = useAppSelector((state) => state.auth);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (accessToken) {
      router.replace(redirectTo || "/");
      return;
    }

    if (tempToken) {
      const target = redirectTo
        ? `/verification?redirect=${encodeURIComponent(redirectTo)}`
        : "/verification";
      router.replace(target);
    }
  }, [accessToken, tempToken, redirectTo, router]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-120 rounded-2xl bg-white/85 shadow-xl"
      >
        <div className="flex justify-center bg-gray-700 px-5 py-4 rounded-t-2xl">
          <BrandLogo variant="inverse" />
        </div>

        <div className="bg-gray-700 py-3">
          <h1 className="text-center text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-center text-md font-medium text-white">
            Enter your credentials to login again
          </p>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {resetMessage && (
                <p className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-center text-sm text-gray-700">
                  {resetMessage}
                </p>
              )}

              <div className="flex flex-col items-center gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-35 bg-gray-700 text-white font-semibold hover:bg-gray-800"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Link href="/forgotpassword" className="text-sm text-gray-600 font-semibold">
                  Forgot password?
                </Link>

                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-gray-600 font-semibold">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginForm;