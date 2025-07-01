import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import Loading from "../../../shared/components/Loading";
import EmptyMapErr from "../../../shared/components/EmptyMapErr";
import useAuthUserTasks from "../../../hooks/useAuthUserTasks";
import TaskCard from "./components/TaskCard";
import TaskFilter from "./components/TasksFilter";

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
