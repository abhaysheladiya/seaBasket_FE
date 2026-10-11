"use client";

import { Card } from "@/components/ui/card";
import { Review } from "@/src/store/slices/productsSlice";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { submitReview } from "@/src/store/slices/productsSlice";
import { useAppSelector } from "@/src/store/hooks";
import { useRouter } from "next/navigation";
import ReviewModal from "./ReviewModal";

type Props = {
  reviews: Review[];
  productId: number;
  onReviewSubmitted?: () => void;
};

const stars = [1, 2, 3, 4, 5];

const ProductReviews = ({ reviews, productId, onReviewSubmitted }: Props) => {
  const router = useRouter();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [reviews]);

  const renderStars = (value: number) =>
    stars.map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));

  const handleOpen = () => {
    if (!accessToken) {
      setShowLoginPrompt(true);
      return;
    }
    setOpen(true);
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!accessToken) {
      setShowLoginPrompt(true);
      return;
    }

    if (rating < 1) {
      setSubmitError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Please add a comment");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitReview(productId, {
        rating,
        comment: comment.trim(),
      });
      resetForm();
      setOpen(false);
      onReviewSubmitted?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Customer Reviews</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleOpen}
          className="px-5 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
        >
          Add Review
        </motion.button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedReviews.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 text-sm">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          sortedReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                      {(review.first_name?.[0] || "U").toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{`${review.first_name} ${review.last_name}`}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">{renderStars(review.rating)}</div>

                <div className="h-px bg-gray-100 my-2" />

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {review.comment}
                </p>
              </Card>
            </motion.div>
          ))
        )}
      </div>
      <ReviewModal
        open={open}
        onClose={() => {
          resetForm();
          setOpen(false);
        }}
        onSubmit={handleSubmit}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        isSubmitting={isSubmitting}
        error={submitError}
      />
      {showLoginPrompt && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowLoginPrompt(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center"
          >
            <h3 className="text-lg font-semibold mb-3">Login Required</h3>
            <p className="text-sm text-gray-600 mb-5">You need to login to write a review.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setShowLoginPrompt(false)}>Cancel</Button>
              <Button onClick={() => router.push("/login")} className="bg-gray-700 text-white cursor-pointer hover:bg-gray-800">
                Login
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductReviews;