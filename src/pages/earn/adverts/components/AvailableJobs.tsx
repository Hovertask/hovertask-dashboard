import { useSelector } from "react-redux";
import type { Task } from "../../../../../types.d";
import TaskCard from "../../../../shared/components/TaskCard";

export default function AvailableJobs() {
	const tasks = useSelector<{ tasks: { value: Task[] | null } }, Task[] | null>(
		(state) => state.tasks.value,
	);

	return (
		<div className="space-y-3">
			<h2 className="text-[21.35px]">New Available Jobs</h2>

			<div className="space-y-4">
				{tasks?.map((task) => (
					<TaskCard {...task} key={task.user_id} />
				))}
			</div>
		</div>
	);
}
