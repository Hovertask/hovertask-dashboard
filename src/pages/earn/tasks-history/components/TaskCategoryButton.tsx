import type useAuthUserTasks from "../../../../hooks/useAuthUserTasks";
import cn from "../../../../utils/cn";

// ✅ Define consistent categories with backend statuses
export const TASK_CATEGORIES = [
	{ key: "pending", label: "Pending" },
	{ key: "approved", label: "Approved" },
	{ key: "rejected", label: "Rejected" },
	{ key: "total", label: "All Tasks" },
];

export default function CategoryButton({
	category,
	currentCategory,
	setCategory,
	stats,
}: {
	category: (typeof TASK_CATEGORIES)[number];
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	currentCategory: string;
	stats: ReturnType<typeof useAuthUserTasks>["stats"];
}) {
	// ✅ Pull count directly from backend stats
	const count = stats?.[category.key] ?? 0;

	return (
		<button
			type="button"
			onClick={() => setCategory(category.key)}
			className={cn(
				"px-4 py-1 rounded-lg flex flex-col gap-y-1 flex-1 border border-gray-300 text-gray-700 font-medium text-sm text-left transition-all",
				{
					"bg-primary/10 text-primary border-primary":
						currentCategory === category.key,
				},
			)}
		>
			<span className="text-lg font-semibold">{count}</span>
			{category.label}
		</button>
	);
}
