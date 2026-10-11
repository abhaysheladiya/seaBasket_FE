import axiosInstance from '@/src/lib/axios';
import { toast } from 'sonner';
import { clearCart, fetchCart } from '@/src/store/slices/cartSlice';
import { AppDispatch } from '@/src/store/store';

export const syncGuestCart = async (
  accessToken: string,
  dispatch: AppDispatch
) => {
  const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');

  if (!guestCart.length) return;

  try {
    const items = guestCart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
    await axiosInstance.post('/cart/sync', items, {});

    localStorage.removeItem('guest_cart');
    dispatch(clearCart());
    dispatch(fetchCart());
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Cart sync failed. Please try again.';
    toast.error(message);
  }
};
