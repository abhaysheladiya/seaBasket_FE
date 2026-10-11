"use client";
import Image from "next/image";
import { Minus, Plus, Trash2, ShieldCheck } from "lucide-react";
import { CartItem } from "@/src/store/slices/cartSlice";
import { Formatter } from "@/src/constants/formatter";
import { Button } from "@/components/ui/button";

interface CartItemsListProps {
  items: CartItem[];
  handleIncrease: (item: CartItem) => void;
  handleDecrease: (item: CartItem) => void;
  handleRemove: (product_id: number) => void;
}

const getItemOriginalTotal = (item: CartItem) =>
  item.totalPrice && item.totalPrice > 0 ? item.totalPrice : item.price * item.quantity;

const getItemDiscountedTotal = (item: CartItem) => {
  const originalTotal = getItemOriginalTotal(item);
  if (item.discountedPrice == null || item.discountedPrice <= 0) {
    return originalTotal;
  }
  const discountedUnitPrice =
    item.discountedPrice > item.price && item.quantity > 1
      ? item.discountedPrice / item.quantity
      : item.discountedPrice;
  return discountedUnitPrice * item.quantity;
};

const CartItemsList = ({
  items,
  handleIncrease,
  handleDecrease,
  handleRemove,
}: CartItemsListProps) => (
  <div className="space-y-4">
    {items.map((item) => {
      const isAtStockLimit =
        typeof item.stock === "number" && item.quantity >= item.stock;
      return (
        <div
          key={item.id}
          className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:flex-row sm:items-center"
        >
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">Premium products, selected with care</p>
            </div>
            <Button
              onClick={() => handleRemove(item.product_id)}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-100 px-3 py-2">
              <Button
                onClick={() => handleDecrease(item)}
                className="rounded-full bg-white text-gray-600 shadow-sm hover:bg-gray-700 hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus className="h-2 w-2" />
              </Button>
              <span className="min-w-7 text-center text-sm font-semibold text-slate-900">
                {item.quantity}
              </span>
              <Button
                onClick={() => handleIncrease(item)}
                className="rounded-full bg-white text-gray-600 shadow-sm hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none disabled:hover:bg-gray-100"
                aria-label="Increase quantity"
                disabled={isAtStockLimit}
              >
                <Plus className="h-2 w-2" />
              </Button>
              {isAtStockLimit ? (
                <span className="text-xs font-semibold text-rose-500">Out of stock</span>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Price</p>
              {item.discountedPrice && item.discountedPrice > 0 ? (
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">
                    {Formatter.format(getItemDiscountedTotal(item))}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                    <span className="line-through">
                      {Formatter.format(getItemOriginalTotal(item))}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                      {(() => {
                        const total = getItemOriginalTotal(item);
                        const discounted = getItemDiscountedTotal(item);
                        return total > 0 ? Math.round(((total - discounted) / total) * 100) : 0;
                      })()}% OFF
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-semibold text-slate-900">
                  {Formatter.format(item.price * item.quantity)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      );
    })}
    <div className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <ShieldCheck className="h-4 w-4" />
        Safe checkout and protected payments
      </div>
      <p className="mt-2 text-sm text-slate-600">
        We keep your details encrypted and never share your data.
      </p>
    </div>
  </div>
);

export default CartItemsList;