"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/src/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200"
      >
        {/* Active Range */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full"
        />
      </SliderPrimitive.Track>

      {/* Thumbs */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="
          block h-5 w-5 rounded-full
          border-2 border-emerald-500
          bg-white
          shadow-md
          transition-all
          hover:scale-110
          hover:shadow-lg
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-emerald-300
        "
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
