"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { cancelOrder, fetchOrders, setOrdersChanged } from "@/src/store/slices/userSlice";
import Loading from "@/src/ui/Loading";
import { Button } from "@/components/ui/button";
import OrdersList from "./OrdersList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.user);

  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancelConfirm = async () => {
    if (!selectedOrderId) return;

    setCancellingId(selectedOrderId);

    try {
      await dispatch(cancelOrder(selectedOrderId));
      dispatch(setOrdersChanged());
      await dispatch(fetchOrders());
      setCancelOpen(false);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">My Orders</h2>
      {orders.length === 0 && <p className="text-center text-gray-500 mt-10">No orders found</p>}
      <OrdersList
        orders={orders}
        openOrderId={openOrderId}
        setOpenOrderId={setOpenOrderId}
        setSelectedOrderId={setSelectedOrderId}
        setCancelOpen={setCancelOpen}
      />
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle>Cancel Order?</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="border-black text-black rounded-xl bg-gray-100 hover:bg-gray-300 cursor-pointer"
                onClick={() => setCancelOpen(false)}
              >
                Keep Order
              </Button>
              <Button
                disabled={cancellingId !== null}
                className="border-none rounded-xl bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                onClick={handleCancelConfirm}
              >
                {cancellingId ? "Cancelling..." : "Cancel Order"}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;