import { Link } from "react-router";
import useTasks from "../../hooks/useTasks";
import EmptyMapErr from "./EmptyMapErr";
import Loading from "./Loading";
import TaskCard from "./TaskCard";

export default function AvailableTasks({
	mode,
	filter,
}: { mode?: "preview"; filter?: string }) {
	const { tasks, reload } = useTasks();
	console.log(tasks);

	if (tasks === null) {
		return <Loading />;
	}

	// Filter tasks based on the selected category (if provided)
	const filteredTasks = filter
		? tasks.filter((task) => task.category === filter)
		: tasks;

	// For preview mode, show only the first 4 tasks
	const displayedTasks =
		mode === "preview" ? filteredTasks.slice(0, 4) : filteredTasks;

	return (
		<div className="space-y-3">
			<h2 className="text-[20.8px]">New Available Tasks</h2>

			{/* Render Tasks */}
			{displayedTasks.length > 0 ? (
				<div className="space-y-4">
					{displayedTasks.map((task) => (
						<TaskCard {...task} key={task.id} />
					))}
				</div>
			) : (
				<EmptyMapErr
					description="There are no tasks available at the moment"
					buttonInnerText="Refresh"
					onButtonClick={reload}
				/>
			)}

			{/* Show “See all tasks” button if in preview mode */}
			{mode === "preview" && filteredTasks.length > 4 && (
				<Link
					to="/earn/tasks"
					className="block w-fit mx-auto px-4 py-2 rounded-full border border-primary text-sm text-primary transition-colors hover:bg-primary/20"
				>
					See all tasks
				</Link>
			)}
		</div>
	);
}
