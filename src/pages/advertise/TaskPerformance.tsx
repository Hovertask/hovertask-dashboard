import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function TaskPerformancePage() {
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

				<TaskPerformance />
			</div>
		</div>
	);
}

function TaskPerformance() {
	return (
		<div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow">
			{/* Header */}
			<div className="flex justify-between items-start border p-4 rounded-lg">
				<div>
					<h3 className="text-sm font-medium text-gray-800 mb-1">
						Follow Us on Instagram and Comment on Our Latest Post
					</h3>
					<p className="text-xs text-gray-600 mb-1">
						Earnings: <span className="text-green-600 font-medium">₦20.00</span>{" "}
						per post engagement.
					</p>
					<p className="text-xs text-gray-600">
						Amount Paid: <span className="font-medium">₦2,000</span> &nbsp; |
						&nbsp; Your Link:{" "}
						<a
							href="https://twitter.com/Akpan4Real7"
							className="text-blue-500 underline"
						>
							https://twitter.com/Akpan4Real7
						</a>
					</p>
				</div>
				<div className="text-right">
					<span className="text-xs text-green-600 font-medium">APPROVED</span>
					<p className="text-[10px] text-gray-400">Jan 15th 2025 6:42 am</p>
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
					<p className="font-medium text-lg text-gray-800">25/50</p>
					<p className="text-gray-500 text-xs">Total Participants</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">
						5 Followers & Comments
					</p>
					<p className="text-gray-500 text-xs">Actions Completed</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">₦5,000 / ₦10,000</p>
					<p className="text-gray-500 text-xs">Budget Spent</p>
				</div>
				<div className="bg-gray-50 p-3 rounded border">
					<p className="font-medium text-lg text-gray-800">50%</p>
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
					task for you. You have to verify each of the tasks performed by the
					users below.
				</p>

				{/* User Result Card */}
				{[
					{
						name: "Ann Lyons",
						handle: "@abrietan18",
						proofLink: "#",
						time: "Jan 15th 2025 6:42 am",
						status: "Completed",
					},
					{
						name: "Sunday Lasis",
						handle: "@delemgold",
						proofLink: "#",
						time: "Jan 15th 2025 6:42 am",
						status: "Completed",
					},
				].map((user, index) => (
					<div
						key={index}
						className="flex items-start justify-between border p-4 rounded-lg mb-3"
					>
						<div>
							<p className="text-sm font-medium text-gray-800">{user.name}</p>
							<p className="text-xs text-gray-600 mb-1">
								Instagram Handle:{" "}
								<span className="text-gray-700">{user.handle}</span>
							</p>
							<a
								href={user.proofLink}
								className="text-xs text-blue-500 underline"
							>
								Advert Proof: Click here to view
							</a>
						</div>
						<div className="text-right">
							<span className="text-xs text-green-600 font-medium">
								{user.status}
							</span>
							<p className="text-[10px] text-gray-400">{user.time}</p>
							<div className="flex gap-2 mt-2 justify-end">
								<button
									type="button"
									className="text-xs px-2 py-1 border border-green-500 text-green-600 rounded-md"
								>
									Accepted
								</button>
								<button
									type="button"
									className="text-xs px-2 py-1 border border-red-500 text-red-600 rounded-md"
								>
									Reject
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
