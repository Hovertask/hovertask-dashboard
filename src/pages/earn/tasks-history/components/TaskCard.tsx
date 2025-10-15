import type useAuthUserTasks from "../../../../hooks/useAuthUserTasks";

const PLATFORMS_IMG_MAP = {
	x: "/images/hugeicons_new-twitter.png",
	tiktok: "/images/logos_tiktok-icon.png",
	facebook: "/images/devicon_facebook.png",
	instagram: "/images/skill-icons_instagram.png",
	whatsapp: "/images/logos_whatsapp-icon.png",
};

export default function TaskCard(
	props: NonNullable<ReturnType<typeof useAuthUserTasks>["tasks"]>[number],
) {
	return (
		<div className="border rounded-xl p-4 shadow-sm bg-white">
			<div className="flex items-center justify-between gap-4">
				<img
					src={
						PLATFORMS_IMG_MAP[
							props.platforms as keyof typeof PLATFORMS_IMG_MAP
						] || "/images/default.png"
					}
					alt={props.platforms}
					className="w-8 h-8 mt-1"
				/>
				<div className="flex items-start gap-4 flex-1">
					<div>
						<h3 className="text-sm font-medium text-gray-800">{props.title}</h3>
						<p className="text-xs text-gray-600 mt-1">
							Earning:{" "}
							<span className="font-medium text-gray-800">
								₦{props.payment_per_task ?? "0.00"}
							</span>{" "}
							per post engagement.
						</p>
						{props.link && (
							<p className="text-xs text-gray-600 mt-1">
								Your Link:{" "}
								<a
									href={props.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline"
								>
									{props.link}
								</a>
							</p>
						)}
					</div>
				</div>
				<div className="flex flex-col items-end justify-between gap-2 self-stretch">
					<span className="text-xs uppercase">
						{props.status || props.admin_approval_status}
					</span>
					<span className="text-xs text-gray-500">
						{new Date(props.created_at).toLocaleString()}
					</span>
				</div>
			</div>
			{ /*<div className="flex justify-end">
				<Link
					to={`/advertise/task-performance/${props.id}`}
					className="mt-2 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
				>
					See full Details
				</Link>
			</div> */}
		</div>
	);
}
