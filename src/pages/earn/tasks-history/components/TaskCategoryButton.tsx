// TaskCategoryButton.tsx
import type useAuthUserTasks from "../../../../hooks/useAuthUserTasks";
import cn from "../../../../utils/cn";

// consistent categories
export const TASK_CATEGORIES = [
	{ key: "pending", label: "Pending" },
	{ key: "accepted", label: "Accepted" },
	{ key: "rejected", label: "Rejected" },
	{ key: "total_tasks", label: "All Tasks" },
];

export default function CategoryButton({
	category,
	currentCategory,
	setCategory,
	stats,
	loading,
}: {
	category: (typeof TASK_CATEGORIES)[number];
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	currentCategory: string;
	stats: ReturnType<typeof useAuthUserTasks>["stats"];
	loading: boolean;
}) {
	// Don't show 0 until stats actually load
	const statsNotReady = !stats || Object.keys(stats).length === 0;
	const count = statsNotReady || loading ? "…" : stats?.[category.key] ?? 0;

	return (
		<button
			type="button"
			onClick={() => setCategory(category.key)}
			className={cn(
				"flex-1 min-w-[70px] max-w-full px-4 py-2 rounded-lg flex flex-col items-start justify-center border border-gray-300 text-gray-700 font-medium text-sm transition-all",
				{
					"bg-primary/10 text-primary border-primary":
						currentCategory === category.key,
				},
			)}
		>
			{/* Count */}
			<span
				className="text-lg font-semibold truncate w-full"
				title={String(count)}
			>
				{count}
			</span>

			{/* Label */}
			<span className="truncate w-full" title={category.label}>
				{category.label}
			</span>
		</button>
	);
}
