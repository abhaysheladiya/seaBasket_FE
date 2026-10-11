"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Formatter } from "@/src/constants/formatter";

type Item = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
};

type Props = {
  items: Item[];
  paymentMethod: "cod" | "card";
  setPaymentMethod: (method: "cod" | "card") => void;
  loading: boolean;
  disabled: boolean;
  formId?: string;
};

const CheckoutRightSection = ({
  items,
  paymentMethod,
  setPaymentMethod,
  loading,
  disabled,
  formId,
}: Props) => {
  const totalAmount = items.reduce((sum, item) => {
    const unitPrice =
      item.discountedPrice && item.discountedPrice > 0 ? item.discountedPrice : item.price;
    return sum + unitPrice;
  }, 0);

  return (
    <Card className="shadow-xl rounded-2xl border-gray-300 h-full">
      <CardContent className="px-6 flex flex-col h-full">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-700">Order Summary</h2>
          <div className="space-y-3 max-h-62 overflow-y-auto pr-1">
            {items.map((item) => {
              const discountedUnitPrice = item.discountedPrice! / item.quantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="text-md font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₹{Math.round(discountedUnitPrice)} per item
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
                    <div className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                      x{item.quantity}
                    </div>
                    <div className="min-w-22.5 text-right text-sm font-bold text-gray-800">
                      ₹{Math.round(item.discountedPrice!)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-auto space-y-4">
          <div className="space-y-3 mt-5">
            <p className="text-sm font-semibold text-gray-700">Select Payment Method</p>

            <div
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-gray-500 bg-gray-100 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  readOnly
                  className="accent-gray-600"
                />
                <div>
                  <p className="font-medium">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Pay securely using Stripe</p>
                </div>
              </div>
              <span className="text-sm text-gray-400"></span>
            </div>

            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "cod"
                  ? "border-gray-500 bg-gray-100 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  readOnly
                  className="accent-gray-600"
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
              <span className="text-sm text-gray-400"></span>
            </div>
          </div>

          <Separator />
          <Button
            type="submit"
            form={formId}
            disabled={loading || disabled}
            className="w-full bg-linear-to-r from-gray-600 to-gray-700 text-white text-lg py-6 rounded-2xl shadow-lg hover:shadow-gray-300 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            {loading
              ? paymentMethod === "card"
                ? "Redirecting..."
                : "Placing Order..."
              : paymentMethod === "card"
                ? `Pay Now • ${Formatter.format(totalAmount)}`
                : `Place Order • ${Formatter.format(totalAmount)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutRightSection;