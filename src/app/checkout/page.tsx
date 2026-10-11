import CheckoutPage from "./components/CheckoutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

const Checkout = () => {
  return <CheckoutPage />;
};

export default Checkout;
