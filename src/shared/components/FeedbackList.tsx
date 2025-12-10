import Feedback from "./Feedback";
import { ProductFeedback } from "../../hooks/useProductFeedback";

export default function FeedbackList({ feedback }: { feedback: ProductFeedback[] }) {
  if (!feedback.length)
    return <p className="text-sm text-gray-500">No feedback yet. Be the first!</p>;

  return (
    <div className="space-y-3">
      {feedback.map((f) => (
        <Feedback
          key={f.id}
          name={`${f.user.fname} ${f.user.lname}`}
          rating={f.rating}
          comment={f.comment}
          date={new Date(f.created_at).toDateString()}
          avatar={f.user.avatar ?? undefined}
        />
      ))}
    </div>
  );
}
