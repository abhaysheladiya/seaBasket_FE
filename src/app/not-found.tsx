"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/src/layout/BrandLogo';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8 bg-linear-to-br from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl"
      >
        <div className="flex justify-center bg-gray-500 px-5 py-4 rounded-t-2xl">
          <BrandLogo variant="inverse" />
        </div>

        <div className="bg-gray-500 py-4 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Page Not Found
          </h1>
        </div>

        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
            <FileQuestion className="w-8 h-8 text-gray-600" />
          </div>

          <h2 className="text-4xl font-bold text-gray-500">404</h2>
          <p>Page Not Found</p>
          <p className="text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>

          <Link href="/">
            <Button className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2 cursor-pointer">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}