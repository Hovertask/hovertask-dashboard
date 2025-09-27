import { useLocation } from "react-router";
import AdvertRequestForm from "./components/AdvertRequestForm";
import Hero from "./components/Hero";

export default function PostAdvertPage() {
  const query = new URLSearchParams(useLocation().search);
  const platform = query.get("platform") || "Engagement"; // default

  return (
    <div className="mobile:grid gap-4 min-h-full">
      <div className="space-y-16 bg-white overflow-hidden min-h-full mobile:max-w-[724px] rounded-2xl mt-4">
        <Hero />
        <div className="text-center max-w-lg mx-auto p-6">
          <h2 className="text-lg font-medium">
            Post a New {platform} Advert Request
          </h2>
          <p className="text-sm">
            Submit your advert request for {platform} and reach your audience
            effectively.
          </p>
        </div>

        {/* ✅ Pass platform dynamically */}
        <AdvertRequestForm platform={platform} />
      </div>
    </div>
  );
}
