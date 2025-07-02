import { Link } from "react-router";

export default function EngagementTaskCard({
	icon: Icon,
	title,
	description,
	price,
}: { [k: string]: any }) {
	return (
		<div className="border rounded-2xl p-5 flex items-center gap-4 bg-white">
			<div className="text-primary">
				<Icon className="w-8 h-8" />
			</div>
			<div className="flex-1">
				<h3 className="font-medium text-sm">{title}</h3>
				<p className="text-gray-600 mt-1 text-xs">{description}</p>
				<hr className="border-dashed mt-1" />
				<p className="text-gray-800 mt-2 font-medium text-xs">{price}</p>
			</div>
			<Link
				to="/advertise/post-advert?type=engagement"
				type="button"
				className="text-xs p-2 bg-primary text-white rounded-xl"
			>
				Create Engagement
			</Link>
		</div>
	);
}
