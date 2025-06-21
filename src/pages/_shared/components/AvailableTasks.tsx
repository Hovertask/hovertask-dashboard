import { Link } from "react-router";
import useTasks from "../../../hooks/useTasks";
import EmptyMapErr from "./EmptyMapErr";
import Loading from "./Loading";
import TaskCard from "./TaskCard";

export default function AvailableTasks({
	mode,
	filter,
}: { mode?: "preview"; filter?: string }) {
	const { tasks, reload } = useTasks();

	return (
		<div className="space-y-3">
			<h2 className="text-[20.8px]">New Available Tasks</h2>

			{tasks === null && <Loading />}

			{/* Without preview mode on, show all the tasks without filtering */}
			{!filter && tasks && tasks.length > 0 && (
				<div className="space-y-4">
					{tasks.map((task) => (
						<TaskCard {...task} key={task.user_id} />
					))}
				</div>
			)}

			{/* Without preview mode on, show all the tasks with filtering */}
			{filter && tasks && tasks.length > 0 && (
				<div className="space-y-4">
					{tasks.map((task) =>
						task.category === filter ? (
							<TaskCard {...task} key={task.user_id} />
						) : null,
					)}
				</div>
			)}

			{/* With preview mode on, show only 4 tasks */}
			{tasks && tasks.length > 0 && (
				<div className="space-y-4">
					{tasks.map((task, i) =>
						i < 4 ? <TaskCard {...task} key={task.user_id} /> : null,
					)}
				</div>
			)}

			{tasks && tasks.length === 0 && (
				<EmptyMapErr
					description="There are no tasks available at the moment"
					buttonInnerText="Refresh"
					onButtonClick={reload}
				/>
			)}

			{mode === "preview" && tasks && tasks.length > 4 && (
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
