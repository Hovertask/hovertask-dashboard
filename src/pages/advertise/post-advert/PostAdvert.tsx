import { useLocation } from "react-router";
import AdvertRequestForm from "./components/AdvertRequestForm";
import Hero from "./components/Hero";

export default function PostAdvertPage() {
  const query = new URLSearchParams(useLocation().search);
  const platform = query.get("platform") || "Engagement"; // default
  const engagementType = query.get("engagementType"); // from EngagementTaskCard link

  // 🧠 Personalized Engagement Campaign Data
  const engagementCampaigns: Record<
    string,
    { title: string; description: string; payment: number }
  > = {
    "Get Real People to Like your Social Media Post": {
      title: "Social Media Likes Campaign",
      description:
        "Engage real users to like your post and boost its visibility organically.",
      payment: 5,
    },
    "Get Real People to Follow you": {
      title: "Follower Growth Campaign",
      description:
        "Increase your social following with genuine and verified users.",
      payment: 10,
    },
    "Get Real People to Comment to your Social Media Post": {
      title: "Post Comments Campaign",
      description:
        "Encourage authentic comments to increase engagement and trust.",
      payment: 10,
    },
    "Get Real People to Subscribe to your Channel": {
      title: "Channel Subscription Campaign",
      description:
        "Get more subscribers who are interested in your content.",
      payment: 15,
    },
  };

  const isEngagement = platform.toLowerCase() === "engagement";
  const selected = engagementType ? engagementCampaigns[engagementType] : null;

  // ✨ Personalized subtitle
  const subtitle = isEngagement
    ? selected
      ? `${selected.description} Starting from ₦${selected.payment} per engagement.`
      : "Engagement tasks let people interact with your posts (likes, comments, or shares)."
    : `Submit your advert request for ${platform} and reach your audience effectively.`;

  return (
    <div className="mobile:grid gap-4 min-h-full">
      <div className="space-y-16 bg-white overflow-hidden min-h-full mobile:max-w-[724px] rounded-2xl mt-4">
        <Hero />
        <div className="text-center max-w-lg mx-auto p-6">
          <h2 className="text-lg font-medium">
            {selected
              ? `Post a New ${selected.title}`
              : `Post a New ${platform} Advert Request`}
          </h2>
          <p className="text-sm">{subtitle}</p>
        </div>

        {/* ✅ Pass platform dynamically */}
        <AdvertRequestForm platform={platform} />
      </div>
    </div>
  );
}
