'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  updateCartItemQuantity,
  deleteCartItem,
  fetchCart,
  deleteCart,
} from '@/src/store/slices/cartSlice';
import { CartItem } from '@/src/store/slices/cartSlice';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';

const CartPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, summary } = useAppSelector((state) => state.cart);
  const { accessToken } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchCart());
  }, [dispatch, isLoggedIn]);

  const derivedSummary = useMemo(() => {
    const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0);
    const originalSubtotal = items?.reduce(
      (sum, item) =>
        sum +
        (item.totalPrice && item.totalPrice > 0
          ? item.totalPrice
          : item.price * item.quantity),
      0
    );
    const discountedSubtotal = items?.reduce((sum, item) => {
      const originalTotal =
        item.totalPrice && item.totalPrice > 0
          ? item.totalPrice
          : item.price * item.quantity;
      if (item.discountedPrice == null || item.discountedPrice <= 0) {
        return sum + originalTotal;
      }
      const discountedUnitPrice =
        item.discountedPrice > item.price && item.quantity > 1
          ? item.discountedPrice / item.quantity
          : item.discountedPrice;
      return sum + discountedUnitPrice * item.quantity;
    }, 0);
    const discount = Math.max(originalSubtotal - discountedSubtotal, 0);
    const discountPercentage =
      originalSubtotal > 0
        ? Math.round((discount / originalSubtotal) * 100)
        : 0;
    return {
      totalItems,
      subTotal: originalSubtotal,
      discount,
      discountPercentage,
      total: discountedSubtotal,
    };
  }, [items]);
  const activeSummary = isLoggedIn && summary ? summary : derivedSummary;
  const { total, discount, subTotal, totalItems, discountPercentage } =
    activeSummary;

  const handleCheckout = () => {
    if (!items.length) return;
    router.push('/checkout');
  };

  const debouncedUpdateQuantity = useDebouncedCallback(
    (id: number, quantity: number) => {
      dispatch(updateCartItemQuantity({ id, quantity }));
    },
    300
  );

  const handleIncrease = useCallback(
    (item: CartItem) => {
      if (isLoggedIn) {
        dispatch(increaseQuantity(item.id));
        debouncedUpdateQuantity(item.product_id, item.quantity + 1);
      } else {
        dispatch(increaseQuantity(item.id));
      }
    },
    [isLoggedIn, dispatch, debouncedUpdateQuantity]
  );

  const handleDecrease = useCallback(
    (item: CartItem) => {
      if (isLoggedIn) {
        if (item.quantity > 1) {
          dispatch(decreaseQuantity(item.id));
          debouncedUpdateQuantity(item.product_id, item.quantity - 1);
        } else {
          dispatch(deleteCartItem(item.product_id));
        }
      } else {
        dispatch(decreaseQuantity(item.product_id));
      }
    },
    [isLoggedIn, dispatch, debouncedUpdateQuantity]
  );

  const handleRemove = (product_id: number) => {
    if (isLoggedIn) {
      dispatch(deleteCartItem(product_id)).then(() => {
        dispatch(fetchCart());
      });
    } else {
      dispatch(removeFromCart(product_id));
    }
  };

  const handleClearCart = async () => {
    if (isLoggedIn) {
      await dispatch(deleteCart());
    } else {
      localStorage.removeItem('guest_cart');
    }
    dispatch(clearCart());
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gray-50 via-white to-gray-50">
      <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-gray-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-60 w-60 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500/80">
              Your Basket
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Cart overview
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              <span suppressHydrationWarning>
                {totalItems > 0
                  ? `${totalItems} items ready for checkout`
                  : `Explore our collection and fill your cart with amazing finds.`}
              </span>
            </p>
          </div>
        </div>
        {!items?.length ? (
          <div className="rounded-3xl border border-gray-200 bg-white/90 p-10 text-center shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Explore our collection and find something you love.
            </p>
            <button
              className="mt-6 h-11 rounded-full bg-gray-700 px-6 text-white hover:bg-gray-800 cursor-pointer"
              onClick={() => router.push('/products')}
            >
              Browse products
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <CartItemsList
              items={items}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
              handleRemove={handleRemove}
            />
            <CartSummary
              subTotal={subTotal}
              discount={Math.round(discount)}
              discountPercentage={discountPercentage}
              total={Math.round(total)}
              handleCheckout={handleCheckout}
              handleClearCart={handleClearCart}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;