import axiosInstance from "@/src/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

type CheckoutResponse = {
  message: string;
  client_secret: string;
  summary: {
    subTotal: number;
    discount: number;
    total: number;
  };
};

type CheckoutState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  client_secret: string;
};

const initialState: CheckoutState = {
  loading: false,
  error: null,
  success: false,
  client_secret: "",
};

type CheckoutItem = {
  product_id: number;
  quantity: number;
};

type CheckoutPayload = {
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  items: CheckoutItem[];
  payment_method: "cod" | "card";
};

export const createCheckoutSession = createAsyncThunk<
  CheckoutResponse,
  CheckoutPayload,
  { rejectValue: string }
>("checkout/createSession", async (payload, { rejectWithValue }) => {
  try {
    let itemsToSend = payload.items || [];
    if (itemsToSend.length && typeof window !== "undefined") {
      const buyNowItem = localStorage.getItem("buy_now_item");
      if (buyNowItem) {
        const item = JSON.parse(buyNowItem);
        itemsToSend = [
          {
            product_id: item.id,
            quantity: item.quantity,
          },
        ];
        payload.items = itemsToSend;
      }
    }
    const res = await axiosInstance.post("orders/checkout", payload);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Checkout failed");
  }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.client_secret = "";
    },
    setSuccessFromRedirect: (state, action) => {
      state.success = action.payload.success;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.client_secret = action.payload.client_secret || "";
        state.success = action.payload.client_secret ? false : true;
        const paymentMethod = action.meta.arg.payment_method;
        const shouldClearBuyNow =
          paymentMethod === "cod" || !action.payload.client_secret;
        if (shouldClearBuyNow && typeof window !== "undefined") {
          localStorage.removeItem("buy_now_item");
        }
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
      });
  },
});

export const { resetCheckoutState, setSuccessFromRedirect } = checkoutSlice.actions;

export default checkoutSlice.reducer;
