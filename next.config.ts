import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "images.pexels.com"],
  },
};

export default nextConfig;
