import type useAuthUserTasks from "../../../../hooks/useAuthUserTasks";
import CategoryButton, { TASK_CATEGORIES } from "./TaskCategoryButton";

export default function TaskFilter({
	category,
	setCategory,
	stats,
}: {
	category: string;
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	stats: ReturnType<typeof useAuthUserTasks>["stats"];
}) {
	return (
		<div className="flex items-center gap-2 p-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
			{TASK_CATEGORIES.map((cat) => (
				<CategoryButton
					key={cat.key}
					category={cat}
					currentCategory={category}
					setCategory={setCategory}
					stats={stats}
				/>
			))}
		</div>
	);
}
