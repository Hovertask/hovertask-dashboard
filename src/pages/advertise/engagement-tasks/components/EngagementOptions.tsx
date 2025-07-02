import { Download, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import EngagementTaskCard from "./EngagementTaskCard";

export default function EngagementOptions() {
	return (
		<div className="space-y-2 max-w-2xl mx-auto">
			<EngagementTaskCard
				icon={ThumbsUp}
				title="Get Real People to Like your Social Media Post"
				description="Become part of our exclusive Telegram group to stay updated with the latest campaigns."
				price="Price: ₦5 per group joined"
			/>
			<EngagementTaskCard
				icon={UserPlus}
				title="Get Real People to Follow you"
				description="Engage actively in group discussions by reacting to posts and sharing your thoughts on campaigns."
				price="Price: ₦10 per Action"
			/>
			<EngagementTaskCard
				icon={MessageCircle}
				title="Get Real People to Comment to your Social Media Post"
				description="Follow our official Instagram page and like the latest three posts to show your support and help boost engagement on our content."
				price="Price: ₦10 per Follow"
			/>
			<EngagementTaskCard
				icon={Download}
				title="Get Real People to Subscribe to your Channel"
				description="Share our branded content with your audience by posting it to your WhatsApp status or Twitter timeline."
				price="Price: ₦15 per Follow"
			/>
		</div>
	);
}
