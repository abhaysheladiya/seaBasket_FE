"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Rocket, CheckCircle, PartyPopper } from "lucide-react";

type Props = {
  accessToken: string | null;
  success: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onClose: () => void;
  onGoProfile: () => void;
};

const CheckoutModals = ({
  accessToken,
  success,
  onLogin,
  onSignup,
  onClose,
  onGoProfile,
}: Props) => {
  return (
    <>
      {!accessToken && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-100 backdrop-blur-xl bg-white/80 border border-white/40 shadow-2xl rounded-3xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2 flex flex-col">
                  <h2 className="text-2xl text-center font-bold text-gray-800 flex items-center justify-center gap-2">
                    Almost there
                    <Rocket className="w-6 h-6 text-orange-500 fill-yellow-400" />
                  </h2>
                  <p className="text-gray-500 text-sm">Login to continue your secure checkout</p>
                </div>
                <Button
                  onClick={onLogin}
                  className="w-full bg-linear-to-r from-gray-600 to-gray-700 text-white text-lg py-6 rounded-2xl shadow-lg hover:shadow-gray-300 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                >
                  Continue to Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={onSignup}
                  className="w-full text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Create an account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white w-[90%] max-w-md p-8 rounded-3xl shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100">
              <CheckCircle className="w-10 h-10 text-gray-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
              <p className="text-gray-500 text-sm flex text-center justify-center">
                Your order has been confirmed <PartyPopper className="w-4 h-4 text-pink-500" />
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onGoProfile}
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white rounded-xl cursor-pointer"
              >
                View Orders
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl cursor-pointer">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CheckoutModals;