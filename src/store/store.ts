import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/store/slices/authSlice";
import categoriesReducer from "./slices/categoriesSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import checkoutReducer from "./slices/checkoutSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      categories: categoriesReducer,
      products: productsReducer,
      cart: cartReducer,
      user: userReducer,
      checkout: checkoutReducer,
    },
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
