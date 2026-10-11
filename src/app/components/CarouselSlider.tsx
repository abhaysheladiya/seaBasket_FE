"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useRouter } from "next/navigation";
import slides from "@/src/constants/carouselImages";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Carousel = () => {
  const router = useRouter();

  const handleShopNow = (name: string) => {
    router.push(`/products?category=${name}`);
  };

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-120"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="bg-black/50 text-center justify-center h-full w-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 text-white">
                  <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>

                  <p className="text-lg mb-6 leading-relaxed">{slide.subtitle}</p>
                  <button
                    onClick={() => handleShopNow(slide.title)}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
