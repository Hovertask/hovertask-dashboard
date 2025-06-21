import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../_shared/components/Loading";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import EmptyMapErr from "../_shared/components/EmptyMapErr";
import cn from "../../utils/cn";

export default function TasksHistoryPage() {
	const [tasks, setTasks] = useState<any[]>();
	const [category, setCategory] = useState("pending");
	const [categoryTasks, setCategoryTasks] = useState<any[]>();
	const getAuthUSerTasks = useCallback(async () => {
		try {
			const response = await fetch(
				`${apiEndpointBaseURL}/advertise/authuserads`,
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					},
				},
			);

			if (!response.ok) return setTimeout(getAuthUSerTasks, 3000);

			setTasks((await response.json()).data);
		} catch {
			setTimeout(getAuthUSerTasks, 3000);
		}
	}, []);

	useEffect(() => {
		getAuthUSerTasks();
	}, [getAuthUSerTasks]);

	useEffect(() => {
		if (tasks) {
			setCategoryTasks(
				tasks.filter((task) => task.admin_approval_status === category),
			);
		}
	}, [tasks, category]);

	return (
		<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
			<div className="bg-white shadow p-4 py-12 space-y-12 min-h-full">
				<div className="flex gap-4 flex-1 w-[800px]">
					<Link className="mt-1" to="/advertise">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">All Social Tasks</h1>
						<p className="text-sm text-zinc-900">
							Track status and earnings from your completed tasks.
						</p>
					</div>
				</div>

				{categoryTasks ? (
					<>
						<div className="flex items-center gap-2 p-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
							<button
								type="button"
								onClick={() => setCategory("pending")}
								className={cn(
									"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
									{
										"bg-primary/10 text-primary border border-gray-300":
											category === "pending",
									},
								)}
							>
								<span>
									{
										tasks?.filter(
											(task) => task.admin_approval_status === "pending",
										).length
									}
								</span>
								Pending
							</button>
							<button
								type="button"
								onClick={() => setCategory("in_review")}
								className={cn(
									"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
									{
										"bg-primary/10 text-primary border border-gray-300":
											category === "in_review",
									},
								)}
							>
								<span>
									{
										tasks?.filter(
											(task) => task.admin_approval_status === "in_review",
										).length
									}
								</span>{" "}
								In Review
							</button>
							<button
								type="button"
								onClick={() => setCategory("failed")}
								className={cn(
									"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
									{
										"bg-primary/10 text-primary border border-gray-300":
											category === "failed",
									},
								)}
							>
								<span>
									{
										tasks?.filter(
											(task) => task.admin_approval_status === "failed",
										).length
									}
								</span>{" "}
								Failed
							</button>
							<button
								type="button"
								onClick={() => setCategory("approved")}
								className={cn(
									"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
									{
										"bg-primary/10 text-primary border border-gray-300":
											category === "approved",
									},
								)}
							>
								<span>
									{
										tasks?.filter(
											(task) => task.admin_approval_status === "approved",
										).length
									}
								</span>{" "}
								Approved
							</button>
							<button
								type="button"
								onClick={() => setCategory("rejected")}
								className={cn(
									"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
									{
										"bg-primary/10 text-primary border border-gray-300":
											category === "rejected",
									},
								)}
							>
								<span>
									{
										tasks?.filter(
											(task) => task.admin_approval_status === "failed",
										).length
									}
								</span>{" "}
								Rejected
							</button>
						</div>

						<hr className="border-dashed" />

						<div className="space-y-2">
							{categoryTasks.length ? (
								categoryTasks.map((task) => (
									<TaskCard key={task.id} {...task} />
								))
							) : (
								<EmptyMapErr
									buttonInnerText="Reload"
									description="No tasks available for this category"
									onButtonClick={getAuthUSerTasks}
								/>
							)}
						</div>
					</>
				) : (
					<Loading fixed />
				)}
			</div>
		</div>
	);
}

function TaskCard(props: any) {
	const platformsImgMap: { [k: string]: string } = {
		x: "/images/hugeicons_new-twitter.png",
		tiktok: "/images/logos_tiktok-icon.png",
		facebook: "/images/devicon_facebook.png",
		instagram: "/images/skill-icons_instagram.png",
		whatsapp: "/images/logos_whatsapp-icon.png",
	};

	return (
		<div className="border rounded-xl p-4 shadow-sm bg-white">
			<div className="flex items-center justify-between gap-4">
				<img
					src={platformsImgMap[props.platforms as string]}
					alt="Instagram"
					className="w-8 h-8 mt-1"
				/>

				<div className="flex items-start gap-4 flex-1">
					<div>
						<h3 className="text-sm font-medium text-gray-800">{props.title}</h3>
						<p className="text-xs text-gray-600 mt-1">
							Earning: <span className="font-medium text-gray-800">₦20.00</span>{" "}
							per post engagement.
						</p>
						<p className="text-xs text-gray-600 mt-1">
							Amount Paid:{" "}
							<span className="font-medium text-gray-800">₦2,000</span>
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
						{props.admin_approval_status}
					</span>
					<span className="text-xs text-gray-500">Jan 15th 2025, 6:42 am</span>
				</div>
			</div>

			<div className="flex justify-end">
				<Link
					to={`/advertise/task-performance/${props.id}`}
					className="mt-2 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
				>
					Track Your Task Performance
				</Link>
			</div>
		</div>
	);
}
