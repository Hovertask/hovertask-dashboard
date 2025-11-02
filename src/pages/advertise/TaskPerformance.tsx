import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";

export default function TaskPerformancePage() {
	const { id } = useParams();
	const [task, setTask] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchTask() {
			try {
				const res = await fetch(`${apiEndpointBaseURL}/advertise/show/${id}`, {
					headers: {
						authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						"Content-Type": "application/json",
					},
				});

				const data = await res.json();
				if (data.status) setTask(data.data);
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
							Monitor task engagement progress in real time and manage participants easily.
						</p>
					</div>
				</div>

				<TaskPerformance task={task} />
			</div>
		</div>
	);
}

function TaskPerformance({ task }: { task: any }) {
	const [filter, setFilter] = useState<string>("all");
	const [selectedProof, setSelectedProof] = useState<string | null>(null);

	const total = task.stats.total_participants;
	const accepted = task.stats.accepted;
	const rejected = task.stats.rejected || 0;
	const pending = task.stats.pending;

	const budgetSpent = accepted * (task.amount_paid / (task.stats.total_participants || 1));
	const completionRate =
		task.stats.total_participants > 0
			? Math.round((accepted / task.stats.total_participants) * 100)
			: 0;

	// Filter participants based on selected status
	const filteredParticipants = task.participants.filter((p: any) => {
		if (filter === "all") return true;
		return p.status === filter;
	});

	return (
		<div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow">
			{/* Header */}
			<div className="flex justify-between items-start border p-4 rounded-lg">
				<div>
					<h3 className="text-sm font-medium text-gray-800 mb-1">{task.title}</h3>
					<p className="text-xs text-gray-600 mb-1">
						Earnings:{" "}
						<span className="text-green-600 font-medium">
							₦{(task.amount_paid / (task.stats.total_participants || 1)).toFixed(2)}
						</span>{" "}
						per engagement.
					</p>
					<p className="text-xs text-gray-600">
						Amount Paid: <span className="font-medium">₦{task.amount_paid}</span> &nbsp; | &nbsp;
						Your Link:{" "}
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
							task.status === "approved" ? "text-green-600" : "text-yellow-600"
						}`}
					>
						{task.status.toUpperCase()}
					</span>
					<p className="text-[10px] text-gray-400">
						{new Date(task.created_at).toLocaleString()}
					</p>
				</div>
			</div>

			{/* Stats (clickable) */}
			<div className="grid grid-cols-5 gap-4 text-center text-sm">
				{[
					{ label: "Total", value: total, key: "all" },
					{ label: "Accepted", value: accepted, key: "accepted" },
					{ label: "Rejected", value: rejected, key: "rejected" },
					{ label: "Pending", value: pending, key: "pending" },
					{
						label: "Completion Rate",
						value: `${completionRate}%`,
						key: "rate",
						disabled: true,
					},
				].map(({ label, value, key, disabled }) => (
					<div
						key={key}
						onClick={() => !disabled && setFilter(key)}
						className={`p-3 rounded border cursor-pointer ${
							filter === key ? "bg-blue-100 border-blue-400" : "bg-gray-50"
						} ${disabled ? "cursor-default opacity-70" : ""}`}
					>
						<p className="font-medium text-lg text-gray-800">{value}</p>
						<p className="text-gray-500 text-xs">{label}</p>
					</div>
				))}
			</div>

			{/* Budget */}
			<div className="text-right text-sm text-gray-600">
				Budget Spent:{" "}
				<span className="font-medium text-gray-800">
					₦{budgetSpent} / ₦{task.amount_paid}
				</span>
			</div>

			{/* Participants */}
			<div>
				<h4 className="text-sm font-medium text-gray-700 mb-2">Participants ({filter})</h4>

				{filteredParticipants.length > 0 ? (
					<div className="space-y-3">
						{filteredParticipants.map((p: any) => (
							<div
								key={p.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div>
									<p className="text-sm font-medium text-gray-800">
										{p.name}{" "}
										<span className="text-gray-500">{p.handle}</span>
									</p>
									<button
										onClick={() => setSelectedProof(p.proof_link)}
										className="text-xs text-blue-600 underline"
									>
										View Proof
									</button>
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
					<p className="text-xs text-gray-500">No {filter} participants yet.</p>
				)}
			</div>

			{/* Proof Modal */}
			{selectedProof && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded-lg max-w-md w-full">
						<h3 className="text-sm font-medium text-gray-700 mb-2">Proof Screenshot</h3>
						<img
							src={selectedProof}
							alt="Proof"
							className="rounded-lg w-full h-auto border"
						/>
						<div className="text-right mt-3">
							<button
								onClick={() => setSelectedProof(null)}
								className="px-4 py-1 bg-gray-800 text-white text-sm rounded"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
