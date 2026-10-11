"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCategories } from "@/src/store/slices/categoriesSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import categoryImages from "@/src/constants/categoriesImages";
import Image from "next/image";
import Loading from "@/src/ui/Loading";

const CategoriesSection = () => {
  const dispatch = useAppDispatch();
  const { items: categories = [], isLoading, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) return <Loading />;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6">{error}</div>;

  return (
    <section className="w-full py-10">
      <div className="px-6 md:px-10 mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Categories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-6 md:px-10">
        {categories.map((category, index) => {
          const image = categoryImages[category.id];

          return (
            <Link key={category.id} href={`/products?category=${category.name}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="cursor-pointer w-full"
              >
                <Card className="relative w-full aspect-4/3 border-none rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all p-0 gap-0">
                  <CardContent className="p-0 h-full">
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 200px"
                        className="object-cover rounded-xl"
                        priority={index < 5}
                      />
                    </div>
                    <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-70 text-center py-2">
                      <p className="text-white font-semibold text-sm truncate">{category.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          );
        })}
      </div>
      <div className="border-b border-gray-200 py-6 mx-9.5"></div>
    </section>
  );
};

export default CategoriesSection;
