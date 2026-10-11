"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddressForm } from "./CheckoutPage";
import { User } from "@/src/store/slices/userSlice";

type Props = {
  register: UseFormRegister<AddressForm>;
  errors: FieldErrors<AddressForm>;
  loading: boolean;
  onEditProfile: () => void;
  user: User | null;
};

const CheckoutLeft = ({ register, errors, onEditProfile, user }: Props) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl py-4 rounded-2xl border border-gray-300 min-h-65">
        <CardContent className="px-8 py-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-700">User Info</h2>
            <Button
              type="button"
              onClick={onEditProfile}
              className="bg-gray-700 text-white px-6 py-2 text-base cursor-pointer rounded-lg hover:bg-gray-800 transition"
            >
              Edit
            </Button>
          </div>
          <div className="space-y-3 text-gray-700 text-lg">
            {!user ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-9 w-20" />
                </div>

                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ) : (
              <>
                <p>
                  <b className="font-semibold">Name:</b> {user.first_name} {user.last_name}
                </p>
                <p>
                  <b className="font-semibold">Email:</b> {user.email}
                </p>
                <p>
                  <b className="font-semibold">Phone:</b> {user.phone}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-xl py-4 rounded-2xl border border-gray-300 min-h-85">
        <CardContent className="px-8 py-4 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-700">Delivery Address</h2>

          <div className="space-y-4">
            <Input
              className="h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-gray-600"
              placeholder="Street"
              {...register("street")}
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}

            <Input
              className="h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-gray-600"
              placeholder="City"
              {...register("city")}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

            <Input
              className="h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-gray-600"
              placeholder="State"
              {...register("state")}
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

            <Input
              className="h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-gray-600"
              placeholder="ZIP Code"
              {...register("zip_code")}
            />
            {errors.zip_code && <p className="text-red-500 text-sm">{errors.zip_code.message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutLeft;