import ProductsPage from "./components/ProductsListingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

const ProductsListingPage = () => {
  return <ProductsPage />;
};

export default ProductsListingPage;
