import { useNavigate, useParams } from "react-router";
import useAdvert from "../../../../hooks/useAdvert";
import { toast } from "sonner";
import cn from "../../../../utils/cn";
import { CircularProgress } from "@heroui/react";
import { AlarmClock, Copy } from "lucide-react";
import Loading from "../../../../shared/components/Loading";
import ProofOfAdvertCompletionForm from "./components/ProofOfAdvertCompletionForm";
import copy from "./utils/copy";

export default function AdvertInfoPage() {
	const { id } = useParams();
	const advert = useAdvert(id!);
	const navigate = useNavigate();

	if (advert === undefined) {
		toast.error(
			"Sorry, We couldn't find the advert you were looking for. You can explore other available adverts.",
		);
		navigate("/earn/adverts");
		return null;
	}

	if (advert === null) return <Loading fixed />;

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="p-4 space-y-8">
				<div className="space-y-4">
					<div>
						<h1 className="text-xl">
							<span className="font-medium">
								{advert.title}
								{advert.category !== "telegram" && " - "}
							</span>
							<span>
								{advert.category !== "telegram" && "1000 Followers Required"}
							</span>
							{new Date().getTime() - new Date(advert.created_at).getTime() >
								24 * 60 * 60 * 1000 && (
								<span className="text-xs text-orange-500"> (New Advert)</span>
							)}
						</h1>
						<p className="text-sm">
							<span className="font-medium">Platforms:</span> {advert.platforms}
						</p>
					</div>

					<div className="max-sm:flex-wrap flex justify-between items-center text-xs max-w-md">
						<span
							className={cn("p-1 px-2 rounded-full", {
								"bg-success/20 text-success": advert.completed === "Available",
								"bg-danger/20 text-danger": advert.completed !== "Available",
							})}
						>
							{advert.completed}
						</span>
						<span className="flex items-center gap-2">
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
							/>{" "}
							{advert.task_count_remaining} of {advert.task_count_total} remaining
						</span>
						<span className="flex items-center gap-2">
							{new Date(
								Date.now() - new Date(advert.created_at).getTime(),
							).getHours()}{" "}
							Hours <AlarmClock size={14} />
						</span>
						<span className="text-base font-semibold text-primary">
							₦{advert.payment_per_task.toLocaleString()}
						</span>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between">
						<h2 className="text-lg font-medium text-primary">Advert Details</h2>
						<button
							type="button"
							className="px-4 py-2 text-sm bg-primary text-white active:scale-95 transition-transform rounded-xl"
						>
							Cancel Advert
						</button>
					</div>

					<div className="text-xs space-y-2">
						<p>
							<span className="font-medium">Platforms:</span> {advert.platforms}
						</p>
						<p>
							<span className="font-medium">Post:</span> {advert.title}
						</p>
						<p className="font-medium">Advert Instructions</p>
						<div className="whitespace-pre-line">{advert.description}</div>
						<p className="font-medium">Reward</p>
						<p>
							Earn ₦{advert.payment_per_task.toLocaleString()} per engagement.{" "}
						</p>
						{advert.social_media_url && (
							<p>
								<span className="font-medium">Advert link:</span>{" "}
								<span className="text-primary bg-primary/20 inline-block px-2 py-1 rounded-full">
									{advert.social_media_url}
								</span>
								<button
									type="button"
									onClick={() => copy(advert.social_media_url || "")}
								>
									<Copy size={14} />
								</button>
							</p>
						)}
					</div>
				</div>

				{advert?.id && <ProofOfAdvertCompletionForm advertId={advert.id} />}

				<div>
					<img src="/images/Group 1000004391.png" alt="" />
				</div>
			</div>
		</div>
	);
}
