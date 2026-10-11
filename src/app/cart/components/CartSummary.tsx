"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { Formatter } from "@/src/constants/formatter";

interface CartSummaryProps {
  subTotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
  handleCheckout: () => void;
  handleClearCart: () => void;
}

const CartSummary = ({
  subTotal,
  discount,
  discountPercentage,
  total,
  handleCheckout,
  handleClearCart,
}: CartSummaryProps) => (
  <aside className="sticky top-24 h-fit rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
    <div className="mt-6 space-y-4 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span>Subtotal</span>
        <span className="font-semibold text-slate-900">{Formatter.format(subTotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500">SeaBasket discount({discountPercentage}%)</span>
        <span className="font-semibold text-gray-500">-{Formatter.format(discount)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Delivery</span>
        <span className="font-semibold text-slate-900">Free</span>
      </div>
      <div className="flex items-center justify-between text-base font-semibold text-slate-900">
        <span>Total</span>
        <span>{Formatter.format(total)}</span>
      </div>
    </div>
    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700">
      You saved {Formatter.format(discount)} on this order
    </div>
    <Button
      onClick={handleCheckout}
      className="mt-6 h-11 w-full rounded-full bg-gray-700 text-white hover:bg-gray-800 cursor-pointer"
    >
      Proceed to checkout
    </Button>
    <Button
      onClick={handleClearCart}
      className="mt-2 h-11 w-full rounded-full bg-red-500 text-white hover:bg-red-600 text-center cursor-pointer"
    >
      Clear Cart
    </Button>
    <div className="text-center justify-center mt-4 flex items-center gap-2 text-xs text-slate-500">
      <Truck className="h-4 w-4 text-gray-500" />
      Delivery within 24 hours in selected cities
    </div>
    <p className="mt-4 text-center text-xs text-slate-500">
      Want to add more?{" "}
      <Link href="/products" className="font-semibold text-gray-700 hover:text-gray-900">
        Continue shopping
      </Link>
    </p>
  </aside>
);

export default CartSummary;