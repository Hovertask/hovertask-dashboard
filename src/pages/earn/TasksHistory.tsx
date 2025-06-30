import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import Loading from "../../shared/components/Loading";
import EmptyMapErr from "../../shared/components/EmptyMapErr";
import cn from "../../utils/cn";
import useAuthUserTasks from "../../hooks/useAuthUserTasks";

// Constants for task categories
const TASK_CATEGORIES = [
	{ key: "pending", label: "Pending" },
	{ key: "in_review", label: "In Review" },
	{ key: "failed", label: "Failed" },
	{ key: "approved", label: "Approved" },
	{ key: "rejected", label: "Rejected" },
];

// Map for platform images
const PLATFORMS_IMG_MAP = {
	x: "/images/hugeicons_new-twitter.png",
	tiktok: "/images/logos_tiktok-icon.png",
	facebook: "/images/devicon_facebook.png",
	instagram: "/images/skill-icons_instagram.png",
	whatsapp: "/images/logos_whatsapp-icon.png",
};

function PageHeader() {
	return (
		<div className="flex gap-4 flex-1">
			<Link className="mt-1" to="/earn/tasks">
				<ArrowLeft />
			</Link>
			<div className="space-y-2">
				<h1 className="text-xl font-medium">All Social Tasks</h1>
				<p className="text-sm text-zinc-900">
					Track status and earnings from your completed tasks.
				</p>
			</div>
		</div>
	);
}

function CategoryButton({
	category,
	currentCategory,
	tasks,
	setCategory,
}: {
	category: (typeof TASK_CATEGORIES)[number];
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	tasks: ReturnType<typeof useAuthUserTasks>["tasks"];
	currentCategory: string;
}) {
	const filteredTasksCount = tasks?.filter(
		(task) => task.admin_approval_status === category.key,
	).length;

	return (
		<button
			type="button"
			onClick={() => setCategory(category.key)}
			className={cn(
				"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left",
				{
					"bg-primary/10 text-primary border border-gray-300":
						currentCategory === category.key,
				},
			)}
		>
			<span>{filteredTasksCount}</span>
			{category.label}
		</button>
	);
}

function TaskFilter({
	category,
	setCategory,
	tasks,
}: {
	category: string;
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	tasks: ReturnType<typeof useAuthUserTasks>["tasks"];
}) {
	return (
		<div className="flex items-center gap-2 p-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
			{TASK_CATEGORIES.map((cat) => (
				<CategoryButton
					key={cat.key}
					category={cat}
					currentCategory={category}
					tasks={tasks}
					setCategory={setCategory}
				/>
			))}
		</div>
	);
}

function TaskCard(props: ReturnType<typeof useAuthUserTasks>["tasks"][number]) {
	return (
		<div className="border rounded-xl p-4 shadow-sm bg-white">
			<div className="flex items-center justify-between gap-4">
				<img
					src={
						PLATFORMS_IMG_MAP[props.platforms as keyof typeof PLATFORMS_IMG_MAP]
					}
					alt={props.platforms}
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

export default function TasksHistoryPage() {
	const { tasks, reload } = useAuthUserTasks();
	const [category, setCategory] = useState("pending");

	const filteredTasks = tasks?.filter(
		(task) => task.admin_approval_status === category,
	);

	return (
		<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
			<div className="bg-white shadow p-4 py-12 space-y-12 min-h-full">
				<PageHeader />

				{tasks ? (
					<>
						<TaskFilter
							category={category}
							setCategory={setCategory}
							tasks={tasks}
						/>

						<hr className="border-dashed" />

						<div className="space-y-2">
							{filteredTasks?.length ? (
								filteredTasks.map((task) => (
									<TaskCard key={task.id} {...task} />
								))
							) : (
								<EmptyMapErr
									buttonInnerText="Reload"
									description="No tasks available for this category"
									onButtonClick={reload}
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
