"use client";

import Carousel from "./CarouselSlider";
import ProductsCategory from "./ProductsCategory";
import TrendingProducts from "./TrendingProducts";
import DealsSection from "./DealsSection";

const HomeContent = () => {
  return (
    <>
      <Carousel />
      <ProductsCategory />
      <DealsSection />
      <TrendingProducts />
    </>
  );
};
export default HomeContent;
