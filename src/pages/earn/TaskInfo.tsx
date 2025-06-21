import { Link, useNavigate, useParams } from "react-router";
import useTask from "../../hooks/useTask";
import { toast } from "sonner";
import cn from "../../utils/cn";
import {
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	useDisclosure,
} from "@heroui/react";
import { AlarmClock, Camera, Copy } from "lucide-react";
import { TaskByline } from "../../../types.d";
import { type FormEvent, useState } from "react";
import Loading from "../_shared/components/Loading";

export default function TaskInfoPage() {
	const { id } = useParams();
	const task = useTask(id!);
	const navigate = useNavigate();

	if (!task) {
		toast.error(
			"Sorry, We couldn't find the task you were looking for. You can explore other available tasks.",
		);
		navigate("/earn/tasks-and-adverts?current-tab=tasks");
	} else
		return (
			<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
				<div className="p-4 space-y-8">
					<div className="space-y-4">
						<div>
							<h1 className="text-xl">
								<span className="font-medium">
									{TaskByline[task.category]}{" "}
									{task.category !== "telegram" && " - "}
								</span>
								<span>
									{task.category !== "telegram" && "1000 Followers Required"}
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
								₦{task.task_amount.toLocaleString()}
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
								Earn ₦{task.task_amount.toLocaleString()} per post engagement.{" "}
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

					<ProofOfTaskCompletion />

					<div>
						<img src="/images/Group 1000004391.png" alt="" />
					</div>
				</div>
			</div>
		);
}

function ProofOfTaskCompletion() {
	const [selectedImageUrl, setSelectedImageUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { onOpen, onOpenChange, isOpen } = useDisclosure();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			setIsSubmitting(true);
		} catch (error) {
			console.log(error);
		} finally {
			setTimeout(() => {
				setIsSubmitting(false);
				onOpen();
			}, 3000);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-lg space-y-4">
			<h3 className="font-medium">Provide Proof of Task Completion</h3>

			<div className="max-sm:flex-wrap flex text-sm items-center gap-4">
				<div className="min-w-28 h-28 bg-black/15 rounded border border-zinc-300 relative [&>*]:cursor-pointer overflow-hidden">
					<span className="absolute flex text-center items-center flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
						<Camera size={12} />
						<span>Upload proof</span>
					</span>
					<input
						onChange={(e) =>
							e.target.files![0] &&
							setSelectedImageUrl((prev) => {
								URL.revokeObjectURL(prev);
								return URL.createObjectURL(e.target.files![0]);
							})
						}
						type="file"
						name="image"
						className="absolute inset-0 opacity-0"
						accept="image/*"
						required
					/>
					<img src={selectedImageUrl} alt="" className="h-full block mx-auto" />
				</div>

				<div className="space-y-1">
					<p>
						Please enter the username of the account you used to perform the
						task, e.g. Instagram username.
					</p>
					<div className="flex items-center gap-4">
						<input
							placeholder="Enter your username"
							className="bg-zinc-200 border border-zinc-300 p-2 rounded-xl flex-1 min-w-0"
							type="text"
							pattern="^\s"
						/>
						<button
							type="button"
							className="px-2 py-1.5 text-sm bg-primary text-white active:scale-95 transition-transform rounded-full"
						>
							Submit Proof
						</button>
					</div>
				</div>
			</div>

			{isSubmitting && <Loading fixed />}

			<Modal size="md" onOpenChange={onOpenChange} isOpen={isOpen}>
				<ModalContent>
					{() => (
						<ModalBody className="space-y-1 text-center pb-8">
							<img src="/images/animated-checkmark.gif" alt="" />
							<h3 className="font-medium text-lg">
								Task Submitted Successfully!
							</h3>
							<p className="text-sm">
								Your task submission has been received and is pending review.
								You'll be notified once it is verified.
							</p>
							<div className="flex items-center justify-center gap-4">
								<Link
									to="/earn/tasks-history"
									className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95"
								>
									View Tasks History
								</Link>
								<Link
									to="/"
									className="p-2 rounded-xl text-sm transition-all border border-primary text-primary active:scale-95"
								>
									Go to Dashboard
								</Link>
							</div>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>
		</form>
	);
}

async function copy(text: string) {
	try {
		await window.navigator.clipboard.writeText(text);
		toast.success("Copied!");
	} catch (error) {
		toast.error("Failed to copy!");
	}
}
