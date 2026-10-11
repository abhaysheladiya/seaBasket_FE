'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductApiResponse } from '@/src/store/slices/productsSlice';
import { Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { addToCart, addToCartAsync } from '@/src/store/slices/cartSlice';
import { resetCheckoutState } from '@/src/store/slices/checkoutSlice';
import { useAppDispatch } from '@/src/store/hooks';
import { toast } from 'sonner';
import { useAppSelector } from '@/src/store/hooks';
import { useRouter } from 'next/navigation';
import { Formatter } from '@/src/constants/formatter';

type Props = {
  product: ProductApiResponse;
  images: string[];
  currentImage: number;
  hasImages: boolean;
  price: number;
  reviewCount: number;
  fullscreen: boolean;
  onImageChange: (index: number) => void;
  onToggleFullscreen: (open: boolean) => void;
};

const ProductInfo = ({
  product,
  images,
  currentImage,
  hasImages,
  price,
  reviewCount,
  fullscreen,
  onImageChange,
  onToggleFullscreen,
}: Props) => {
  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-6 w-6 ${
          star <= Math.round(rating)
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-300'
        }`}
      />
    ));

  const originalPrice = Number(price);
  const discount = Number(product.discount);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = Number(product.stock) <= 0;

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
          discountedPrice: Number(product.discounted_price) || 0,
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

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error('Stock not available');
      return;
    }
    dispatch(resetCheckoutState());
    if (typeof window !== 'undefined') {
      const item = {
        id: product.id,
        name: product.name,
        quantity: 1,
        price: Number(product.price) || 0,
        discountedPrice: Number(product.discounted_price),
        image: product.images?.[0],
      };

      localStorage.setItem('buy_now_item', JSON.stringify(item));
    }
    router.push('/checkout?buyNow=1');
  };

  useEffect(() => {
    if (!hasImages || images.length <= 1 || fullscreen) return;

    const interval = setInterval(() => {
      onImageChange((currentImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage, images.length, hasImages, onImageChange, fullscreen]);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <div
          className="relative rounded-2xl overflow-hidden p-1 cursor-zoom-in"
          onClick={() => hasImages && onToggleFullscreen(true)}
        >
          <div className="rounded-2xl overflow-hidden">
            {hasImages ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={images[currentImage]}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={images[currentImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="object-cover w-full h-87.5 sm:h-130 rounded-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-87.5 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring' }}
              onClick={() => onImageChange(idx)}
              className={`rounded-lg overflow-hidden border transition ${
                currentImage === idx ? 'border-gray-500' : 'border-gray-200'
              }`}
            >
              <Image
                src={img}
                alt="thumb"
                width={70}
                height={70}
                className="rounded-lg object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-start mt-2">
        <h1 className="text-3xl sm:text-4xl font-semibold">{product.name}</h1>

        <p className="text-gray-500 mt-2 text-lg">
          Category: {product.category?.name ?? 'Uncategorized'}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {renderStars(Number(product.average_rating))}
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <span className="text-3xl font-bold text-gray-700">
            {Formatter.format(product.discounted_price)}
          </span>

          <span className="text-base text-gray-400 line-through">
            {Formatter.format(originalPrice)}
          </span>

          <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        </div>
        <p className="text-gray-600 mt-5 leading-relaxed text-sm sm:text-base">
          {product.description}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Stock Available: {product.stock}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium shadow-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            aria-busy={isAdding}
          >
            {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="flex-1 bg-yellow-400 text-black py-3 rounded-lg font-medium shadow-sm hover:bg-yellow-500 cursor-pointer"
            onClick={handleBuyNow}
          >
            Buy Now
          </motion.button>
        </div>
      </div>
      {fullscreen && hasImages && (
        <RemoveScroll>
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => onToggleFullscreen(false)}
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/75 transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFullscreen(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <Image
                src={images[currentImage]}
                alt="fullscreen"
                width={900}
                height={900}
                className="rounded-xl object-fit max-h-[85vh]"
              />
            </motion.div>
          </div>
        </RemoveScroll>
      )}
    </div>
  );
};

export default ProductInfo;