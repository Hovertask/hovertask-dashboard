import type useAuthUserTasks from "../../../../hooks/useAuthUserTasks";
import cn from "../../../../utils/cn";

// Constants for task categories
export const TASK_CATEGORIES = [
	{ key: "pending", label: "Pending" },
	{ key: "in_review", label: "In Review" },
	{ key: "failed", label: "Failed" },
	{ key: "approved", label: "Approved" },
	{ key: "rejected", label: "Rejected" },
];

export default function CategoryButton({
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
