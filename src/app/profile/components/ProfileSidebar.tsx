"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/src/lib/utils";
import { User, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  activeTab: "profile" | "address" | "orders";
  setActiveTab: (tab: "profile" | "address" | "orders") => void;
};

const ProfileSidebar = ({ activeTab, setActiveTab }: Props) => {
  return (
    <aside className="w-full h-100 rounded-2xl p-6 bg-white/90 backdrop-blur shadow-xl ring-1 ring-gray-200">
      <div className="mb-6 rounded-xl p-4 bg-linear-to-br from-gray-50 via-white to-gray-100 ring-1 ring-gray-200">
        <p className="text-sm uppercase tracking-wider text-gray-500">Account Center</p>
        <h2 className="text-lg font-semibold text-gray-700">Profile</h2>
        <p className="text-md text-gray-600">Manage your info, addresses, and orders.</p>
      </div>
      <nav className="flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-4 py-6 text-base transition-colors duration-300",
              activeTab === "profile"
                ? "bg-gray-700 text-white shadow-md hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100",
            )}
            onClick={() => setActiveTab("profile")}
          >
            <User size={22} />
            <span className="font-medium text-md">My Profile</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-4 py-6 text-base transition-colors duration-300",
              activeTab === "address"
                ? "bg-gray-700 text-white shadow-md hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100",
            )}
            onClick={() => setActiveTab("address")}
          >
            <MapPin size={22} />
            <span className="font-medium">Address</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-4 py-6 text-base transition-colors duration-300",
              activeTab === "orders"
                ? "bg-gray-700 text-white shadow-md hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100",
            )}
            onClick={() => setActiveTab("orders")}
          >
            <Package size={22} />
            <span className="font-medium">Orders</span>
          </Button>
        </motion.div>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;