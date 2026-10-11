'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  fetchProducts,
  setPage,
  setFilters,
  ProductFilters,
  setSort,
} from '@/src/store/slices/productsSlice';
import ProductsFiltersSidebar from './ProductsFiltersSidebar';
import ProductsListSection from './ProductsListSection';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { list, page, isLoading, filters, sortBy, error } = useAppSelector(
    (state) => state.products
  );

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryParam = searchParams.get('category');
  const searchName = searchParams.get('search');

  useEffect(() => {
    const updatedFilters: ProductFilters = {};

    if (searchName) updatedFilters.search = searchName;
    if (categoryParam) updatedFilters.category = categoryParam;

    dispatch(setFilters(updatedFilters));
    dispatch(setPage(1));
  }, [searchName, categoryParam, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [page, filters, sortBy, dispatch]);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-10 py-6 grid grid-cols-12 gap-6 lg:gap-10">
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      <ProductsFiltersSidebar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      <ProductsListSection
        list={list}
        isLoading={isLoading}
        error={error}
        page={page}
        setPage={(p) => dispatch(setPage(p))}
        sortBy={sortBy}
        setSort={(s) => dispatch(setSort(s))}
        setIsFilterOpen={setIsFilterOpen}
      />
    </div>
  );
};

export default ProductsPage;
