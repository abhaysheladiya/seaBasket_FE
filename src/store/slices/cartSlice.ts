import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/src/lib/axios';
import { RootState } from '../store';
import { toast } from 'sonner';

export type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
  discountedPrice?: number;
  totalPrice?: number;
  discount?: number;
};

type FetchCartResponse = {
  data: CartItem[];
  summary: CartSummary | null;
  _fromCache?: boolean;
};

type CartSummary = {
  totalItems: number;
  subTotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
};

type CartState = {
  items: CartItem[];
  summary: CartSummary | null;
  lastFetchedAt?: number;
  isChanged?: boolean;
};
type CartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number;
  persist?: boolean;
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  }
};

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('guest_cart');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const fetchCart = createAsyncThunk<
  FetchCartResponse,
  void,
  { state: RootState }
>('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  const state = getState().cart;
  if (!state.isChanged && state.lastFetchedAt) {
    return { data: state.items, summary: state.summary, _fromCache: true };
  }
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch cart');
  }
});

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (
    {
      product_id,
      quantity,
      stock,
    }: { product_id: number; quantity: number; name: string; stock?: number },
    { rejectWithValue, getState }
  ) => {
    try {
      if (typeof stock === 'number' && Number.isFinite(stock)) {
        const state = getState() as RootState;
        const currentQty =
          state.cart.items.find(
            (item) => item.product_id === product_id || item.id === product_id
          )?.quantity || 0;
        if (currentQty > stock) {
          const message =
            stock > 0 ? `Only ${stock} in stock` : 'Out of stock';
          return rejectWithValue(message);
        }
      }
      await axiosInstance.post('/cart/add', {
        product_id,
        quantity,
      });
      return { product_id, quantity };
    } catch (error) {
      const message =
        error?.response?.data?.error?.message || 'Failed to add item to cart';
      return rejectWithValue(message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { id, quantity }: { id: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axiosInstance.patch(`/cart/${id}`, { quantity });
      await dispatch(fetchCart());
      return { id, quantity };
    } catch (err) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to update';
      toast.error(message);
      await dispatch(fetchCart());
      return rejectWithValue(err.response?.data || message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteItem',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cart/product/${id}`);
      await dispatch(fetchCart());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Delete failed');
    }
  }
);

export const deleteCart = createAsyncThunk(
  'cart/deleteCart',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/cart');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: CartState = {
  items: loadCartFromStorage(),
  summary: null,
  lastFetchedAt: undefined,
  isChanged: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItemInput>) {
      state.isChanged = true;
      const existingItem = state.items?.find(
        (item) => item.id === action.payload.id
      );
      const incomingQty = action.payload.quantity || 1;
      const incomingStock = action.payload.stock;

      if (
        typeof incomingStock === 'number' &&
        Number.isFinite(incomingStock) &&
        action.payload.persist !== false
      ) {
        const currentQty = existingItem?.quantity || 0;
        if (currentQty + incomingQty > incomingStock) {
          toast.error(
            incomingStock > 0
              ? `Only ${incomingStock} in stock`
              : 'Out of stock'
          );
          return;
        }
      }

      if (existingItem) {
        existingItem.quantity += incomingQty;
      } else {
        state.items.push({
          ...action.payload,
          quantity: incomingQty,
        });
      }
      if (action.payload.persist !== false) {
        saveCartToStorage(state.items);
        toast.success(
          action.payload.name
            ? `${action.payload.name} added to cart`
            : 'Added to cart'
        );
      }
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      state.isChanged = true;
      const item = state.items.find((entry) => entry.id === action.payload);
      if (!item) return;
      if (typeof item.stock === 'number' && item.quantity >= item.stock) {
        toast.error(item.stock > 0 ? `Only ${item.stock} in stock` : 'Out of stock');
        return;
      }
      item.quantity += 1;
      saveCartToStorage(state.items);
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      state.isChanged = true;
      const idx = state.items.findIndex((entry) => entry.id === action.payload);
      if (idx === -1) return;
      const item = state.items[idx];
      if (item.quantity > 1) item.quantity -= 1;
      else state.items.splice(idx, 1);
      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.isChanged = true;
      state.items = state.items.filter((entry) => entry.id !== action.payload);
      saveCartToStorage(state.items);
    },
    clearCart(state) {
      state.isChanged = true;
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (!action.payload._fromCache) {
          state.items = action.payload.data || [];
          state.summary = action.payload.summary;
          state.lastFetchedAt = Date.now();
          state.isChanged = false;
        }
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const name = action.meta.arg?.name;
        toast.success(name ? `${name} added to cart` : 'Added to cart');
        state.isChanged = true;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        const message =
          (action.payload as string) || 'Failed to add item to cart';
        toast.error(message);
        const { product_id, quantity } = action.meta.arg || {};
        const qty = quantity || 1;
        const item = state.items.find(
          (i) => i.product_id === product_id || i.id === product_id
        );
        if (!item) return;
        if (item.quantity > qty) {
          item.quantity -= qty;
        } else {
          state.items = state.items.filter((i) => i !== item);
        }
        state.isChanged = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const item = state.items.find(
          (i) =>
            i.id === action.payload.id || i.product_id === action.payload.id
        );
        if (item) {
          item.quantity = action.payload.quantity;
        }
        state.isChanged = true;
      })
      .addCase(updateCartItemQuantity.rejected, (state) => {
        state.isChanged = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) =>
            item.id !== action.payload && item.product_id !== action.payload
        );
        state.isChanged = true;
      });
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
