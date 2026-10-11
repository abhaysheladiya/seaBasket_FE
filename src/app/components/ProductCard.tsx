'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { addToCart, addToCartAsync } from '@/src/store/slices/cartSlice';
import { ProductApiResponse } from '@/src/store/slices/productsSlice';
import { useAppSelector } from '@/src/store/hooks';
import { Formatter } from '@/src/constants/formatter';
import { useAppDispatch } from '@/src/store/hooks';
import { toast } from 'sonner';

type Props = {
  product: ProductApiResponse;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = Number(product.stock) <= 0;

  const goToProduct = () => router.push(`/products/${product.slug}`);
  const { accessToken } = useAppSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (isAdding) return;
    if (isOutOfStock) {
      toast.error('Stock not available');
      return;
    }
    setIsAdding(true);
    try {
      dispatch(
        addToCart({
          id: product.id,
          product_id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          discountedPrice: Number(product.discounted_price ?? 0) || 0,
          image: product.images?.[0].image_url ?? '',
          stock: typeof product.stock === 'number' ? product.stock : Number(product.stock),
          persist: !accessToken,
        })
      );
      if (accessToken) {
        await dispatch(
          addToCartAsync({
            product_id: product.id,
            quantity: 1,
            name: product.name,
            stock:
              typeof product.stock === 'number'
                ? product.stock
                : Number(product.stock),
          })
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card
        onClick={goToProduct}
        className="pt-0 rounded-3xl overflow-hidden shadow-2xl hover:shadow-gray-400/40 transition-all duration-500 hover:-translate-y-1 hover:scale-105 border border-gray-300 cursor-pointer bg-gray-50 flex flex-col"
      >
        <div className="relative w-full aspect-4/3 sm:aspect-3/2 md:aspect-4/3">
          {product.images?.[0]?.image_url?.trim() ? (
            <Image
              src={product.images?.[0]?.image_url?.trim()}
              alt={product.name}
              fill
              className="object-cover"
              style={{
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
              }}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 font-semibold bg-gray-100">
              No image available
            </div>
          )}
        </div>
        <CardContent className="flex flex-col justify-between p-4 gap-3 flex-1">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 min-h-14">
              {product.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-sm">
                {'⭐'.repeat(Math.round(Number(product.average_rating)))}
              </span>
              <span className="text-gray-500 text-sm">
                ({product.average_rating})
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-gray-700 font-extrabold text-lg">
                {Formatter.format(product.discounted_price)}
              </span>
              <span className="text-gray-400 line-through text-sm">
                {Formatter.format(product.price)}
              </span>
            </div>
            <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-md">
              {product.discount}% OFF
            </span>
          </div>
          <CardFooter className="mt-2 p-0">
            <Button
              className="w-full h-12 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isAdding || isOutOfStock}
              aria-busy={isAdding}
            >
              {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default ProductCard;