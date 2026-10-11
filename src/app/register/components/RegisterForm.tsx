"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import BrandLogo from "@/src/layout/BrandLogo";
import { registerUser } from "@/src/store/slices/authSlice";
import { useEffect } from "react";

type RegisterFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isLoading, success } = useAppSelector((state) => state.auth.register);

  const form = useForm<RegisterFormValues>({
    mode: "onSubmit",
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (success) router.push("/verification");
  }, [success, router]);

  const onSubmit = (data: RegisterFormValues) => {
    dispatch(registerUser({ ...data, phone: Number(data.phone) }));
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white/85 shadow-xl backdrop-blur-sm">
        <div className="flex justify-center bg-gray-700/90 px-5 py-4">
          <BrandLogo variant="inverse" />
        </div>

        <div className="bg-gray-700/90 py-3 text-center text-white text-xl font-semibold">
          Create A New Account
        </div>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8"
          >
            <FormField
              control={form.control}
              name="first_name"
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      placeholder="Enter your last name"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "Phone is required",
                validate: (value) => value.length === 10 || "Phone must be 10 digits",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter your phone number"
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const numeric = raw.replace(/[^0-9]/g, "");
                        const limited = numeric.slice(0, 10);
                        field.onChange(limited);
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === form.getValues("password") || "Passwords do not match",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm focus:border-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-3">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <div className="sm:col-span-2 flex flex-col items-center gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-40 bg-gray-700 text-white font-semibold hover:bg-gray-800"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              <p className="text-sm">
                Have an account?{" "}
                <Link href="/login" className="text-gray-700 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default RegisterForm;