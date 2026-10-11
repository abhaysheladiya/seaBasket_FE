'use client';

import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchTrendingProducts } from '@/src/store/slices/productsSlice';
import ProductCard from '@/src/app/components/ProductCard';
import Loading from '@/src/ui/Loading';

const TrendingProducts = () => {
  const dispatch = useAppDispatch();

  const { trending, trendingLoading, trendingError } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  if (trendingLoading) return <Loading />;

  if (trendingError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6">
        {trendingError}
      </div>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-12">
      <Toaster position="top-center" richColors />
      <h2 className="text-4xl font-bold mb-2 text-gray-800">
        Trending Products
      </h2>
      <p className="text-slate-950 mb-8">Most loved by our customers</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trending.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
