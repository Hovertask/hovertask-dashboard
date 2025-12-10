// src/shared/components/FeedbackForm.tsx
import { useState } from "react";
import { toast } from "sonner";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";

export default function FeedbackForm({
  productId,
  onSuccess,
}: { productId: number; onSuccess: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${apiEndpointBaseURL}/products/${productId}/feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          visitor_name: visitorName,
          visitor_email: visitorEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to submit feedback");
        return;
      }

      toast.success("Feedback submitted!");
      setComment("");
      setVisitorEmail("");
      setVisitorName("");

      onSuccess(); // 🔥 SWR-style refresh
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <h3 className="font-semibold">Write a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded w-full"
      >
        {[5,4,3,2,1].map((r) => (
          <option key={r} value={r}>
            ⭐ {r} Star
          </option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Write your review..."
      />

      <input
        placeholder="Your Name"
        value={visitorName}
        onChange={(e) => setVisitorName(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <input
        placeholder="Your Email"
        value={visitorEmail}
        onChange={(e) => setVisitorEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={submitFeedback}
        disabled={loading}
        className="w-full py-2 bg-primary text-white rounded"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}
