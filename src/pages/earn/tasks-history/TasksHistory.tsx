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
	const [category, setCategory] = useState("accepted");
	const { tasks, stats, reload, loading } = useAuthUserTasks(category);

	return (
		<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
			<div className="bg-white shadow p-4 py-12 space-y-12 min-h-full">
				<PageHeader />

				{loading ? (
					<Loading fixed />
				) : tasks ? (
					<>
						{/* ✅ Total Earnings Section */}
						<div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
							<p className="text-sm text-gray-700">Total Earnings</p>
							<h2 className="text-2xl font-semibold text-green-700">
								₦{stats?.total_earnings?.toLocaleString() ?? "0.00"}
							</h2>
						</div>

						{/* ✅ Task Filter Buttons */}
						<TaskFilter
							category={category}
							setCategory={setCategory}
							stats={stats}
						/>

						<hr className="border-dashed" />

						{/* ✅ Task List */}
						<div className="space-y-2">
							{tasks?.length ? (
								tasks.map((task) => <TaskCard key={task.id} {...task} />)
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
