"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfilePage from "./ProfilePage";
import AddressesPage from "./AddressPage";
import OrdersPage from "./OrdersPage";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "orders">("profile");
  const { accessToken } = useAuthGuard();

  if (!accessToken) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfilePage />;
      case "address":
        return <AddressesPage />;
      case "orders":
        return <OrdersPage />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <div className="lg:sticky lg:top-24">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <main className="min-w-0">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ProfileDashboard;
