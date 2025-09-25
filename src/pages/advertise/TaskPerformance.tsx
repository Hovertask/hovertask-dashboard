import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

export default function TaskPerformancePage() {
	const { id } = useParams(); // assuming route is /advertise/:id
	const [task, setTask] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchTask() {
			try {
				const res = await fetch(`/api/advertises/${id}`); // Laravel route
				const data = await res.json();
				if (data.status) {
					setTask(data.data);
				}
			} catch (error) {
				console.error("Error fetching task", error);
			} finally {
				setLoading(false);
			}
		}

		fetchTask();
	}, [id]);

	if (loading) return <p className="p-6">Loading...</p>;
	if (!task) return <p className="p-6">Task not found.</p>;

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-6 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/advertise">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Track Your Task Performance</h1>
						<p className="text-sm text-zinc-900">
							Monitor the progress of your engagement tasks in real time and
							make adjustments as needed.
						</p>
					</div>
				</div>

				<TaskPerformance task={task} />
			</div>
		</div>
	);
}

function TaskPerformance({ task }: { task: any }) {
	// calculate budget spent & completion rate safely
	const budgetSpent = task.stats.accepted * (task.amount_paid / task.stats.total_participants || 1);
	const completionRate =
		task.stats.total_participants > 0
			? Math.round((task.stats.accepted / task.stats.total_participants) * 100)
			: 0;

	return (
		<div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow">
			{/* Header */}
			<div className="flex justify-between items-start border p-4 rounded-lg">
				<div>
					<h3 className="text-sm font-medium text-gray-800 mb-1">
						{task.title}
					</h3>
					<p className="text-xs text-gray-600 mb-1">
						Earnings:{" "}
						<span className="text-green-600 font-medium">
							₦{(task.amount_paid / (task.stats.total_participants || 1)).toFixed(2)}
						</span>{" "}
						per post engagement.
					</p>
					<p className="text-xs text-gray-600">
						Amount Paid: <span className="font-medium">₦{task.amount_paid}</span>{" "}
						&nbsp; | &nbsp; Your Link:{" "}
						<a
							href={task.link}
							className="text-blue-500 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{task.link}
						</a>
					</p>
				</div>
				<div className="text-right">
					<span
						className={`text-xs font-medium ${
							task.admin_approval_status === "approved"
								? "text-green-600"
								: "text-yellow-600"
						}`}
					>
						{task.admin_approval_status.toUpperCase()}
					</span>
					<p className="text-[10px] text-gray-400">
						{new Date(task.created_at).toLocaleString()}
					</p>
				</div>
			</div>

			{/* Track Button */}
			<div className="flex justify-end">
				<button
					type="button"
					className="text-white bg-blue-600 text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
				>
					Track Your Task Performance
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-4 gap-4 text-center text-sm">
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">
						{task.stats.total_participants}
					</p>
					<p className="text-gray-500 text-xs">Total Participants</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">
						{task.stats.accepted} Accepted
					</p>
					<p className="text-gray-500 text-xs">Actions Completed</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">
						₦{budgetSpent} / ₦{task.amount_paid}
					</p>
					<p className="text-gray-500 text-xs">Budget Spent</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">
						{completionRate}%
					</p>
					<p className="text-gray-500 text-xs">Completion Rate</p>
				</div>
			</div>

			{/* Allocation Results */}
			<div>
				<h4 className="text-sm font-medium text-gray-700 mb-2">
					Allocation Results
				</h4>
				<p className="text-xs text-gray-600 mb-4">
					Your order will be allocated to various users so they can perform your
					task for you. You have to verify each of the tasks performed.
				</p>

				{task.participants.length > 0 ? (
					<div className="space-y-3">
						{task.participants.map((p: any) => (
							<div
								key={p.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div>
									<p className="text-sm font-medium text-gray-800">
										{p.name}{" "}
										<span className="text-gray-500">{p.handle}</span>
									</p>
									<a
										href={p.proof_link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-blue-600 underline"
									>
										Proof
									</a>
									<p className="text-xs text-gray-500">
										{new Date(p.submitted_at).toLocaleString()}
									</p>
								</div>
								<div className="flex gap-2">
									{p.status === "pending" && (
										<>
											<button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
												Accept
											</button>
											<button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
												Reject
											</button>
										</>
									)}
									{p.status !== "pending" && (
										<span
											className={`px-2 py-1 text-xs rounded ${
												p.status === "accepted"
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{p.status.toUpperCase()}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-xs text-gray-500">No allocations yet.</p>
				)}
			</div>
		</div>
	);
}
