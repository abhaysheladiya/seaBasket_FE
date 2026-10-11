'use client';
import ProductCard from '@/src/app/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  ProductApiResponse,
  SortOption,
} from '@/src/store/slices/productsSlice';

interface ProductsListSectionProps {
  list: ProductApiResponse[];
  isLoading: boolean;
  error?: string;
  page: number;
  setPage: (page: number) => void;
  sortBy: SortOption | '';
  setSort: (sort: SortOption) => void;
  setIsFilterOpen: (open: boolean) => void;
}

const ProductsListSection = ({
  list,
  isLoading,
  error,
  page,
  setPage,
  sortBy,
  setSort,
  setIsFilterOpen,
}: ProductsListSectionProps) => (
  <section className="col-span-12 lg:col-span-9">
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Button
          className="lg:hidden bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-2 text-sm"
          onClick={() => setIsFilterOpen(true)}
        >
          Filters
        </Button>
      </div>
      <div className="flex justify-end">
        <Select
          value={sortBy}
          onValueChange={(value) => setSort(value as SortOption)}
        >
          <SelectTrigger className="w-40 sm:w-55 bg-white border border-gray-200 shadow-sm rounded-lg">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>

          <SelectContent
            side="bottom"
            align="end"
            avoidCollisions={false}
            className="bg-white border border-gray-200 shadow-xl rounded-lg"
          >
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {error && (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6">
        {error}
      </div>
    )}
    {isLoading || !list ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    ) : list.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    ) : (
      <div className="text-center py-20 text-muted-foreground">
        No products found
      </div>
    )}
    <div className="flex justify-center items-center gap-6 mt-8 flex-wrap">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </Button>
      <span className="font-medium">Page {page}</span>
      <Button
        variant="outline"
        disabled={!list.length}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  </section>
);

export default ProductsListSection;
