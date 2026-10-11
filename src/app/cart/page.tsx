import CartPage from "./components/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

const Cart = () => {
  return <CartPage />;
};

export default Cart;
