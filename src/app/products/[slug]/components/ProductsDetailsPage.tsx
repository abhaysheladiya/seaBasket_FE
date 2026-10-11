"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchProductById, invalidateProductBySlug } from "@/src/store/slices/productsSlice";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import Loading from "@/src/ui/Loading";

type Props = {
  slug: string;
};

const ProductDetailsPage = ({ slug }: Props) => {
  const dispatch = useAppDispatch();

  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.products);

  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const refreshProduct = useCallback(() => {
    dispatch(fetchProductById(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    refreshProduct();
  }, [refreshProduct]);

  if (isLoading) return <Loading />;

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (!selectedProduct) return null;

  const imageUrls = (selectedProduct.images ?? []).map((image) => image.image_url);

  return (
    <section className="px-6 lg:px-12 py-10">
      <ProductInfo
        product={selectedProduct}
        images={imageUrls}
        currentImage={currentImage}
        hasImages={imageUrls.length > 0}
        price={selectedProduct.price}
        reviewCount={selectedProduct.reviews?.length ?? 0}
        fullscreen={isFullscreenImage}
        onImageChange={setCurrentImage}
        onToggleFullscreen={setIsFullscreenImage}
      />

      <ProductReviews
        reviews={selectedProduct.reviews ?? []}
        productId={selectedProduct.id}
        onReviewSubmitted={() => {
          dispatch(invalidateProductBySlug(slug));
          refreshProduct();
        }}
      />
    </section>
  );
};

export default ProductDetailsPage;
