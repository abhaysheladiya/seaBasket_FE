"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Package, Truck, Home, Clock } from "lucide-react";

import { Formatter } from "@/src/constants/formatter";
import { Button } from "@/components/ui/button";
import { Order } from "@/src/store/slices/userSlice";

export interface OrdersListProps {
  orders: Order[];
  openOrderId: number | null;
  setOpenOrderId: (id: number | null) => void;
  setSelectedOrderId: (id: number | null) => void;
  setCancelOpen: (open: boolean) => void;
}

const steps = ["Pending", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const stepIcons = {
  Pending: <Clock size={20} />,
  Packed: <Package size={20} />,
  Shipped: <Truck size={20} />,
  "Out for Delivery": <Truck size={20} />,
  Delivered: <Home size={20} />,
};

const mapStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "packed":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
};

const OrdersList = ({
  orders,
  openOrderId,
  setOpenOrderId,
  setSelectedOrderId,
  setCancelOpen,
}: OrdersListProps) => (
  <div className="space-y-6">
    {orders.map((order) => {
      const status = mapStatus(order.status);
      const currentStepIndex = steps.indexOf(status);
      return (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 shadow-md cursor-pointer bg-white ring-1 ring-gray-200"
          onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
        >
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-800">Order ID: {order.id}</span>
            <div className="flex gap-3 items-center">
              <span className="text-gray-500 text-sm">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  status === "Delivered"
                    ? "bg-gray-600"
                    : status === "Out for Delivery"
                      ? "bg-amber-500"
                      : status === "Shipped"
                        ? "bg-blue-500"
                        : status === "Packed"
                          ? "bg-yellow-500"
                          : status === "Cancelled"
                            ? "bg-red-500"
                            : "bg-purple-500"
                }`}
              >
                {status}
              </span>
            </div>
          </div>
          <div className="mb-2 text-gray-700">
            {order.items.slice(0, 2).map((item) => (
              <p key={item.id}>
                {item.product?.name} x {item.quantity} -{" "}
                {Formatter.format(Number(item.final_price))}
              </p>
            ))}
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-gray-800">
              Total: {Formatter.format(Number(order.total))}
            </span>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              View Tracking
            </span>
          </div>
          {status !== "Cancelled" && (
            <div className="flex items-center justify-between border rounded-xl p-4 bg-gray-50">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Expected Delivery</span>
                <span className="text-sm font-semibold text-gray-800">
                  {new Date(order.expected_delivery_date).toLocaleDateString()}
                </span>
              </div>
              {status === "Pending" && (
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrderId(order.id);
                    setCancelOpen(true);
                  }}
                  className="text-sm px-4 py-2 border-red-200 bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                >
                  Cancel Order
                </Button>
              )}
            </div>
          )}
          <AnimatePresence>
            {openOrderId === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 bg-gray-100 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span>{Formatter.format(Number(item.final_price))}</span>
                    </div>
                  ))}
                  <div className="mt-2 border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{Formatter.format(Number(order.total))}</span>
                  </div>
                </div>
                {order.address && (
                  <div className="mt-4 bg-white p-4 rounded-xl ring-1 ring-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address
                    </h3>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}
                    </p>
                    <p>{order.address.zip_code}</p>
                  </div>
                )}
                {status === "Cancelled" ? (
                  <div className="mt-6 text-center text-red-500 font-semibold">
                    This order has been cancelled
                  </div>
                ) : (
                  <div className="flex mt-6">
                    {steps.map((step, index) => {
                      const completed = index <= currentStepIndex;
                      return (
                        <div key={step} className="flex-1 text-center">
                          <div
                            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${completed ? "bg-gray-700 text-white" : "bg-gray-300"}`}
                          >
                            {completed ? <Check size={16} /> : stepIcons[step]}
                          </div>
                          <p className="text-xs mt-1">{step}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    })}
  </div>
);

export default OrdersList;