"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dealsCarousel from "@/src/constants/offers";

const DealsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % dealsCarousel.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-4 relative">
      <div className="px-6 md:px-10 mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Offers & Deals</h2>
      </div>
      <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-150 overflow-hidden">
        {dealsCarousel.map((deal, index) => (
          <Link
            key={deal.id}
            href={`/products?category=${deal.query}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-gray-900/80 via-gray-800/50 to-transparent" />
              <div className="absolute left-5 sm:left-8 md:left-10 top-1/2 -translate-y-1/2 text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3">
                  {deal.subtitle}
                </h2>
                <p className="text-sm sm:text-lg md:text-xl mb-3 sm:mb-5">{deal.title}</p>

                <button className="bg-gray-700 hover:bg-gray-800 transition px-4 sm:px-6 py-2 sm:py-3 rounded-md font-semibold shadow text-sm sm:text-base md:text-lg cursor-pointer">
                  Shop Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="border-b border-gray-200 py-6 mx-9.5"></div>
    </section>
  );
};

export default DealsSection;