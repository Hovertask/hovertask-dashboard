import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../../shared/components/Loading";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import EmptyMapErr from "../../shared/components/EmptyMapErr";
import cn from "../../utils/cn";

export default function EngagementTasksHistoryPage() {
	const [tasks, setTasks] = useState<any[]>();
	const [category, setCategory] = useState("success");
	const [categoryTasks, setCategoryTasks] = useState<any[]>();

	const getAuthUSerTasks = useCallback(async () => {
		try {
			const response = await fetch(`${apiEndpointBaseURL}/tasks/authusertasks`, {
				headers: { authorization: `Bearer ${localStorage.getItem("auth_token")}` },
			});

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
			setCategoryTasks(tasks.filter((task) => task.status === category));
		}
	}, [tasks, category]);

	if (!categoryTasks) return <Loading fixed />;

	const categoryStatuses = [
		{ key: "pending", label: "Pending" },
		{ key: "in_review", label: "In Review" },
		{ key: "failed", label: "Failed" },
		{ key: "success", label: "Approved" },
		{ key: "rejected", label: "Rejected" },
	];

	return (
		<div className="min-h-full grid grid-cols-1 md:grid-cols-[1fr_214px] gap-4 p-2 md:p-4">
			<div className="bg-white shadow-md px-4 py-6 md:px-6 md:py-8 space-y-6 overflow-hidden min-h-full">
				{/* Header */}
				<div className="flex items-start gap-3 md:gap-4">
					<Link to="/advertise" className="mt-1">
						<ArrowLeft />
					</Link>
					<div className="space-y-1">
						<h1 className="text-lg md:text-xl font-medium">All Social Tasks</h1>
						<p className="text-xs md:text-sm text-zinc-900">
							Track status and earnings from your completed tasks.
						</p>
					</div>
				</div>

				{/* Category Filter Buttons */}
				<div className="flex flex-wrap gap-2 p-3 md:p-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
					{categoryStatuses.map((cat) => (
						<button
							key={cat.key}
							type="button"
							onClick={() => setCategory(cat.key)}
							className={cn(
								"flex-1 min-w-[70px] max-w-full px-3 py-2 rounded-lg flex flex-col items-start justify-center border border-gray-300 text-gray-700 font-medium text-sm transition-all truncate",
								{
									"bg-primary/10 text-primary border-primary":
										category === cat.key,
								}
							)}
						>
							<span className="text-base md:text-lg font-semibold truncate w-full" title={`${tasks?.filter(t => t.status === cat.key).length}`}>
								{tasks?.filter((t) => t.status === cat.key).length}
							</span>
							<span className="truncate w-full" title={cat.label}>
								{cat.label}
							</span>
						</button>
					))}
				</div>

				<hr className="border-dashed" />

				{/* Task Cards */}
				<div className="space-y-3">
					{categoryTasks.length ? (
						categoryTasks.map((task) => <TaskCard key={task.id} {...task} />)
					) : (
						<EmptyMapErr
							buttonInnerText="Reload"
							description="No tasks available for this category"
							onButtonClick={getAuthUSerTasks}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

// ------------------ TaskCard ------------------
function TaskCard(props: any) {
	const platformsImgMap: { [k: string]: string } = {
		x: "/images/hugeicons_new-twitter.png",
		tiktok: "/images/logos_tiktok-icon.png",
		facebook: "/images/devicon_facebook.png",
		instagram: "/images/skill-icons_instagram.png",
		whatsapp: "/images/logos_whatsapp-icon.png",
	};

	return (
		<div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col md:flex-row gap-3 md:gap-4">
			{/* Platform Icon */}
			<img
				src={platformsImgMap[(props.platforms as string)?.toLowerCase()]}
				alt={(props.platforms as string)?.toLowerCase()}
				className="w-8 h-8 flex-shrink-0 mt-1"
			/>

			{/* Task Details */}
			<div className="flex-1 flex flex-col md:flex-row justify-between gap-2">
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-medium text-gray-800 truncate">{props.title}</h3>
					<p className="text-xs text-gray-600 mt-1 truncate">
						Earning: <span className="font-medium text-gray-800">₦20.00</span> per post
					</p>
					<p className="text-xs text-gray-600 mt-1 truncate">
						Budget: <span className="font-medium text-gray-800">₦{props.task_amount ?? "0"}</span>
					</p>
					{props.link && (
						<p className="text-xs text-gray-600 mt-1 truncate">
							Your Link:{" "}
							<a
								href={props.link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline truncate"
							>
								{props.link}
							</a>
						</p>
					)}
				</div>

				{/* Status & Date */}
				<div className="flex flex-col items-start md:items-end justify-between gap-1 text-xs flex-shrink-0">
					<span className="uppercase">{props.status}</span>
					<span className="text-gray-500">{new Date(props.created_at).toLocaleString()}</span>
				</div>
			</div>

			{/* Action Button */}
			<div className="flex justify-end mt-2 md:mt-0">
				<Link
					to={`/advertise/engagement-task-performance/${props.id}`}
					className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 truncate"
				>
					Track Your Engagement-Task Performance
				</Link>
			</div>
		</div>
	);
}
// ------------------ End of TaskCard ------------------