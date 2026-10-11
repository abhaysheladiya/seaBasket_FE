"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

const stars = [1, 2, 3, 4, 5];

const ReviewModal = ({
  open,
  onClose,
  onSubmit,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  error,
}: Props) => {
  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <div className="flex gap-2 mb-4">
          {stars.map((star) => (
            <Star
              key={star}
              onClick={() => setRating(star)}
              className={`w-6 h-6 cursor-pointer transition-all duration-200 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400 scale-110"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          ))}
        </div>
        <Textarea
          placeholder="Share your experience..."
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-800 transition"
          >
            {isSubmitting ? <span className="animate-pulse">Submitting...</span> : "Submit"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;