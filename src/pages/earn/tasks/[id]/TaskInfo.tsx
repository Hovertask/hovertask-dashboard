import { useNavigate, useParams } from "react-router";
import useTask from "../../../../hooks/useTask";
import { toast } from "sonner";
import cn from "../../../../utils/cn";
import { CircularProgress } from "@heroui/react";
import { AlarmClock, Copy } from "lucide-react";
import Loading from "../../../../shared/components/Loading";
import ProofOfTaskCompletionForm from "./components/ProofOfCompletionForm";
import copy from "./utils/copy";

export default function TaskInfoPage() {
	const { id } = useParams();
	const task = useTask(id!);
	const navigate = useNavigate();

	if (task === undefined) {
		toast.error(
			"Sorry, We couldn't find the task you were looking for. You can explore other available tasks.",
		);
		navigate("/earn/tasks");
		return null;
	}

	if (task === null) return <Loading fixed />;

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="p-4 space-y-8">
				<div className="space-y-4">
					<div>
						<h1 className="text-xl">
							<span className="font-medium">
								{task.title}
								{task.category !== "telegram" && " - "}
							</span>
							<span>
								{task.category !== "telegram" && ""}
							</span>
							{new Date().getTime() - new Date(task.created_at).getTime() >
								24 * 60 * 60 * 1000 && (
								<span className="text-xs text-orange-500"> (New Task)</span>
							)}
						</h1>
						<p className="text-sm">
							<span className="font-medium">Platforms:</span> {task.platforms}
						</p>
					</div>

					<div className="max-sm:flex-wrap flex justify-between items-center text-xs max-w-md">
						<span
							className={cn("p-1 px-2 rounded-full", {
								"bg-success/20 text-success": task.completed === "Available",
								"bg-danger/20 text-danger": task.completed !== "Available",
							})}
						>
							{task.completed}
						</span>
						<span className="flex items-center gap-2">
							<CircularProgress
								color={
									task.completion_percentage > 69
										? "success"
										: task.completion_percentage > 44
											? "warning"
											: "danger"
								}
								formatOptions={{ style: "percent" }}
								showValueLabel
								size="sm"
								value={task.completion_percentage}
							/>{" "}
							{task.task_count_remaining} of {task.task_count_total} remaining
						</span>
						<span className="flex items-center gap-2">
							{new Date(
								Date.now() - new Date(task.start_date).getTime(),
							).getHours()}{" "}
							Hours <AlarmClock size={14} />
						</span>
						<span className="text-base font-semibold text-primary">
							₦{task.payment_per_task.toLocaleString()}
						</span>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between">
						<h2 className="text-lg font-medium text-primary">Task Details</h2>
						<button
							type="button"
							className="px-4 py-2 text-sm bg-primary text-white active:scale-95 transition-transform rounded-xl"
						>
							Cancel Task
						</button>
					</div>

					<div className="text-xs space-y-2">
						<p>
							<span className="font-medium">Platforms:</span> {task.platforms}
						</p>
						<p>
							<span className="font-medium">Post:</span> {task.title}
						</p>
						<p className="font-medium">Task Instructions</p>
						<div className="whitespace-pre-line">{task.description}</div>
						<p className="font-medium">Reward</p>
						<p>
							Earn ₦{task.payment_per_task.toLocaleString()} per  engagement.{" "}
						</p>
						{task.social_media_url && (
							<p>
								<span className="font-medium">Task link:</span>{" "}
								<span className="text-primary bg-primary/20 inline-block px-2 py-1 rounded-full">
									{task.social_media_url}
								</span>
								<button
									type="button"
									onClick={() => copy(task.social_media_url || "")}
								>
									<Copy size={14} />
								</button>
							</p>
						)}
					</div>
				</div>

				{task?.id && (
                  <ProofOfTaskCompletionForm
                       taskId={task.id}
                       platform={task.platforms?.toLowerCase()}
                  />
                )}



				<div>
					<img src="/images/Group 1000004391.png" alt="" />
				</div>
			</div>
		</div>
	);
}
