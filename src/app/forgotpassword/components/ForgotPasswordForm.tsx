"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import BrandLogo from "@/src/layout/BrandLogo";
import { forgotPassword } from "@/src/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

const emailSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof emailSchema>;

const ForgotPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, message } = useAppSelector((state) => state.auth.forgotPassword);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    dispatch(forgotPassword({ email: data.email }));
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white/85 shadow-xl backdrop-blur-sm"
      >
        <div className="flex justify-center bg-gray-700/90 px-5 py-4">
          <BrandLogo variant="inverse" />
        </div>
        <div className="bg-gray-700/90 py-3">
          <h1 className="text-center text-2xl font-semibold text-white">Forgot Password</h1>
        </div>
        <div className="p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4 rounded-md border border-gray-300 bg-gray-100 p-6 text-center"
              >
                <p className="text-sm font-medium text-gray-700">
                  {message || "Password reset link has been sent to your email."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!message && (
            <Form {...form}>
              <form noValidate className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-neutral-700">
                        Email<span className="text-red-500">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          id="email"
                          type="text"
                          placeholder="Enter your email"
                          {...field}
                          className={`mt-2 h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors ${fieldState.error
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-300 focus:border-gray-500"
                            }`}
                          disabled={isLoading}
                        />
                      </FormControl>

                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-10 w-44 bg-gray-700 px-6 text-md font-semibold text-white hover:bg-gray-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <div className="mt-6 flex justify-center">
            {message ? (
              <Button className="h-10 w-44 bg-gray-700 px-6 text-md font-semibold text-white hover:bg-gray-800">
                <Link href="/login">Back to Login</Link>
              </Button>
            ) : (
              <p className="text-sm">
                Remember Your Password?
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                >
                  Back to Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgotPasswordForm;