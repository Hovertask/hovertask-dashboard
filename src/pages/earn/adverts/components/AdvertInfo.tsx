import { useNavigate, useParams } from "react-router";
import useAdvert from "../../../../hooks/useAdvert";
import { toast } from "sonner";
import cn from "../../../../utils/cn";
import { CircularProgress } from "@heroui/react";
import { Copy } from "lucide-react";
import Loading from "../../../../shared/components/Loading";
import ProofOfAdvertCompletionForm from "./components/ProofOfAdvertCompletionForm";
import copy from "./utils/copy";

export default function AdvertInfoPage() {
  const { id } = useParams();
  const advert = useAdvert(id!);
  const navigate = useNavigate();

  if (advert === undefined) {
    toast.error(
      "Sorry, We couldn't find the advert you were looking for. You can explore other available adverts."
    );
    navigate("/earn/adverts");
    return null;
  }

  if (advert === null) return <Loading fixed />;

  // Determine the actual media URL to use
  const mediaUrl = advert.media_type === "video" ? advert.file_path : advert.video_path;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 min-h-full p-4">
      {/* ------------------ LEFT SIDE: Instructions / Task Details ------------------ */}
      <div className="space-y-8">
        {/* Advert Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{advert.title}</h1>
          <p className="text-sm text-gray-600">
            Platforms: <strong>{advert.platforms}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Posted {Date.now() - new Date(advert.created_at).getTime() > 24 * 60 * 60 * 1000 ? "over 24h ago" : "recently"}
          </p>
        </div>

        {/* Media Display */}
        {mediaUrl ? (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 flex flex-col gap-4">
            {advert.media_type === "video" ? (
              <video
                src={advert.video_path || ""}
                controls
                className="rounded-xl w-full max-h-[400px]"
              />
            ) : (
              <img
                src={advert.file_path || ""}
                alt="Advert Media"
                className="rounded-xl w-full max-h-[400px] object-cover"
              />
            )}

            {/* Download & Share Buttons */}
            <div className="flex flex-wrap gap-2">
              <a
                href={mediaUrl}
                download
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-primary/90 transition"
              >
                Download Media
              </a>
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                onClick={() => {
                  if (mediaUrl && navigator.share) {
                    navigator
                      .share({
                        title: advert.title,
                        url: mediaUrl,
                      })
                      .catch((err) => console.error(err));
                  } else {
                    toast.error("Sharing not supported on this browser");
                  }
                }}
              >
                Share to Social Media
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">No media available</div>
        )}

        {/* Step-by-step Instructions */}
        <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <h2 className="text-lg font-medium text-primary mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Check the platforms listed above for your task.</li>
            <li>Download the media (image/video) using the button above.</li>
            <li>Post the downloaded media to your social media account as instructed.</li>
            <li>Submit proof of completion using the form below once your post is live.</li>
            <li>Monitor your task completion and reward in the summary panel.</li>
          </ol>

          {/* Advert Description */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-1">Advert Details</h3>
            <div className="whitespace-pre-line text-sm text-gray-700">{advert.description}</div>

            {/* Advert Link */}
            {advert.social_media_url && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-primary bg-primary/20 px-2 py-1 rounded-full">
                  {advert.social_media_url}
                </span>
                <button
                  type="button"
                  onClick={() => copy(advert.social_media_url || "")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Completion Form */}
          {advert?.id && <ProofOfAdvertCompletionForm advertId={advert.id} />}
        </div>
      </div>

      {/* ------------------ RIGHT SIDE: Summary & Progress ------------------ */}
      <div className="space-y-6 sticky top-4">
        {/* Status Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 space-y-3">
          <h2 className="text-lg font-medium text-primary flex items-center gap-2">
            Summary
          </h2>

          {/* Completion Badge */}
          <span
            className={cn(
              "p-1 px-3 rounded-full text-sm",
              advert.completed === "Available"
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            )}
          >
            {advert.completed}
          </span>

          {/* Progress Bar */}
          <div className="flex justify-between items-center gap-2 text-sm">
            <CircularProgress
              color={
                advert.completion_percentage > 69
                  ? "success"
                  : advert.completion_percentage > 44
                  ? "warning"
                  : "danger"
              }
              formatOptions={{ style: "percent" }}
              showValueLabel
              size="sm"
              value={advert.completion_percentage}
            />
            <span>
              {advert.task_count_remaining} of {advert.task_count_total} remaining
            </span>
          </div>

          {/* Time & Reward */}
          <div className="flex justify-between items-center text-sm">
            <span>
              {Math.floor((Date.now() - new Date(advert.created_at).getTime()) / 1000 / 3600)} Hours since posted
            </span>
            <span className="font-semibold text-primary">
              ₦{advert.payment_per_task.toLocaleString()} per task
            </span>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            className="w-full mt-2 px-4 py-2 text-sm bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition"
          >
            Cancel Advert
          </button>
        </div>

        {/* Decorative Image */}
        <div>
          <img src="/images/Group 1000004391.png" alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
}
