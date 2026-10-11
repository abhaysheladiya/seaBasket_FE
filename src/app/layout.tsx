import type { Metadata } from "next";
import Providers from "@/src/app/providers";
import "./globals.css";
import { Toaster } from "sonner";
import AuthInitializer from "../utils/AuthInitializer";
import ConditionalLayout from "@/src/layout/ConditionalLayout";

export const metadata: Metadata = {
  title: "SeaBasket",
  description: "SeaBasket shopping experience",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-neutral-900">
        <Providers>
          <AuthInitializer />
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-center" duration={4000} richColors />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;