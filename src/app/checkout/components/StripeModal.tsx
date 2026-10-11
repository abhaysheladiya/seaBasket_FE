"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StripeModal({ isOpen, onClose }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isProcessing) {
      setIsProcessing(false);
    }
    onClose();
  };

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (isProcessing) return;
    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?success=true`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment Failed Please Try Again");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-[90%] max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-3xl shadow-2xl p-6 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
          <p className="text-sm text-gray-500">Pay safely using Stripe</p>
        </div>
        <div className="w-full border border-gray-200 rounded-xl p-5 bg-gray-50">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePay}
            disabled={!stripe || !elements || isProcessing}
            className="w-full bg-linear-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium shadow-md transition-all hover:scale-[1.02] hover:shadow-gray-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={handleClose}
            className="w-full border border-gray-300 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}