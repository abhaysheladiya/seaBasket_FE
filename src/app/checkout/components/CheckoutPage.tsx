'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { useSearchParams } from 'next/navigation';
import {
  createCheckoutSession,
  resetCheckoutState,
  setSuccessFromRedirect,
} from '@/src/store/slices/checkoutSlice';
import { fetchUser, fetchAddress } from '@/src/store/slices/userSlice';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CheckoutLeftSection from './CheckoutLeftSection';
import CheckoutRightSection from './CheckoutRightSection';
import CheckoutModals from './CheckoutModals';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeModal from './StripeModal';
import { clearCart } from '@/src/store/slices/cartSlice';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const addressSchema = z.object({
  street: z
    .string()
    .min(3, 'Street is required')
    .transform((s) => s.trim()),
  city: z
    .string()
    .min(2, 'City is required')
    .regex(/^[a-zA-Z\s]+$/, 'City must contain only letters')
    .transform((s) => s.trim()),
  state: z
    .string()
    .min(2, 'State is required')
    .regex(/^[a-zA-Z\s]+$/, 'State must contain only letters')
    .transform((s) => s.trim()),
  zip_code: z
    .string()
    .regex(/^\d{4,6}$/, 'zip_code must be numeric and 4 to 6 digits')
    .transform((s) => s.trim()),
});

export type AddressForm = z.infer<typeof addressSchema>;

type BuyNowItem = {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  image?: string;
};

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { user, address: userAddress } = useAppSelector((state) => state.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { accessToken } = useAppSelector((state) => state.auth);
  const { client_secret, success, loading } = useAppSelector(
    (state) => state.checkout
  );

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('card');

  const shouldOpenStripe = paymentMethod === 'card' && !!client_secret;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchUser());
    dispatch(fetchAddress());
  }, [dispatch, accessToken]);

  const buyNowItem: BuyNowItem | null = (() => {
    try {
      const raw = localStorage.getItem('buy_now_item');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const successParam = searchParams.get('success');

    if (successParam && !success) {
      dispatch(
        setSuccessFromRedirect({
          success: true,
        })
      );
      router.push('/checkout');
    }
  }, [searchParams, dispatch, success, router]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('buy_now_item');
      }
    };
  }, []);

  const itemsForCheckout = buyNowItem ? [buyNowItem] : cartItems;
  const addressFormId = 'checkout-address-form';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (userAddress) {
      reset({
        street: userAddress.street,
        city: userAddress.city,
        state: userAddress.state,
        zip_code: userAddress.zip_code,
      });
    }
  }, [userAddress, reset]);

  const handleModalClose = () => {
    dispatch(resetCheckoutState());
    dispatch(clearCart());
    router.push('/');
  };

  const handleViewOrders = () => {
    dispatch(resetCheckoutState());
    dispatch(clearCart());
    router.push('/profile');
  };

  const onSubmit = async (data: AddressForm) => {
    if (!user) return;

    const formattedItems = itemsForCheckout.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    dispatch(
      createCheckoutSession({
        address: data as {
          street: string;
          city: string;
          state: string;
          zip_code: string;
        },
        items: formattedItems,
        payment_method: paymentMethod,
      })
    );
  };

  if (!buyNowItem && !cartItems.length && accessToken && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-8 text-center space-y-4 shadow-xl rounded-2xl border-gray-300">
          <h2 className="text-2xl font-bold text-gray-700">
            Your cart is empty
          </h2>

          <p className="text-gray-500 text-sm">
            Looks like you haven't added anything yet.
          </p>

          <Button
            className="w-full bg-linear-to-r from-gray-600 to-gray-700 text-white text-lg py-6 rounded-2xl shadow-lg hover:shadow-gray-300 transition-all duration-300 hover:scale-[1.03]"
            onClick={() => router.push('/products')}
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 p-6">
      <div
        className={`${
          !accessToken ? 'blur-sm opacity-60 pointer-events-none' : ''
        } ${shouldOpenStripe ? 'blur-sm' : ''}`}
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <form
            id={addressFormId}
            onSubmit={handleSubmit(onSubmit)}
            className="h-full"
          >
            <CheckoutLeftSection
              register={register}
              errors={errors}
              loading={loading}
              onEditProfile={() => router.push('/profile')}
              user={user}
            />
          </form>

          <CheckoutRightSection
            items={itemsForCheckout}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loading={loading}
            disabled={!accessToken}
            formId={addressFormId}
          />
        </motion.div>
      </div>
      <CheckoutModals
        accessToken={accessToken}
        success={success}
        onLogin={() => router.push('/login')}
        onSignup={() => router.push('/register')}
        onClose={handleModalClose}
        onGoProfile={handleViewOrders}
      />

      {shouldOpenStripe && client_secret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: client_secret }}
        >
          <StripeModal
            isOpen={shouldOpenStripe}
            onClose={() => {
              dispatch(resetCheckoutState());
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;