"use client";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setFilters, setPage } from "@/src/store/slices/productsSlice";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface ProductsFiltersSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const ProductsFiltersSidebar = ({
  isFilterOpen,
  setIsFilterOpen,
  priceRange,
  setPriceRange,
}: ProductsFiltersSidebarProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { filters } = useAppSelector((state) => state.products);
  const { minDiscount: selectedDiscount, minRating: selectedRating } = filters;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50
        transform transition-transform duration-300
        ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:h-fit lg:w-auto
        col-span-12 lg:col-span-3
        border-r lg:border border-gray-300
        rounded-none lg:rounded-xl
        p-6 shadow-sm
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Filters</h2>
        <div className="flex items-center gap-3">
          <button
            className="text-sm text-gray-600 hover:underline cursor-pointer"
            onClick={() => {
              setPriceRange([0, 5000]);
              dispatch(
                setFilters({
                  minPrice: undefined,
                  maxPrice: undefined,
                  minDiscount: undefined,
                  minRating: undefined,
                  category: undefined,
                  search: undefined,
                }),
              );
              dispatch(setPage(1));
              router.replace(window.location.pathname);
            }}
          >
            Clear All
          </button>
          <button className="lg:hidden" onClick={() => setIsFilterOpen(false)}>
            <X size={20} />
          </button>
        </div>
      </div>
      <Separator className="mb-6" />
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-4">Price Range</h3>
          <Slider
            className="border border-gray-300 rounded-lg cursor-pointer"
            value={priceRange}
            max={50000}
            step={50}
            onValueChange={(value) => setPriceRange(value)}
            onValueCommit={(value) =>
              dispatch(
                setFilters({
                  minPrice: value[0],
                  maxPrice: value[1],
                }),
              )
            }
          />
          <div className="flex justify-between text-sm mt-2 text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-md font-medium mb-3">Discount</h3>
          <div className="space-y-3 text-sm">
            {[20, 30, 40, 50].map((d) => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedDiscount === d}
                  onCheckedChange={(checked) =>
                    dispatch(
                      setFilters({
                        minDiscount: checked ? d : undefined,
                      }),
                    )
                  }
                />
                <span>{d}% or more</span>
              </label>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-md font-medium mb-3">Customer Rating</h3>
          <div className="space-y-3 text-sm">
            {[4, 3].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedRating === r}
                  onCheckedChange={(checked) =>
                    dispatch(
                      setFilters({
                        minRating: checked ? r : undefined,
                      }),
                    )
                  }
                />
                <span>⭐ {r}★ & above</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductsFiltersSidebar;