import { ArrowLeft, Gift, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import AddMeUpAside from "../../shared/components/AddMeUpAside";

export default function PointsPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/add-me-up/list-profile">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Add Me Up Points</h1>
						<p className="text-sm text-zinc-500">Manage your points</p>
					</div>
				</div>

				<PointsBoard />
				<RecentTransactions />
			</div>

			<AddMeUpAside />
		</div>
	);
}

function PointsBoard() {
	return (
		<div>
			<div className="p-4 sm:p-8 shadow-md rounded-3xl">
				<div className="flex justify-between items-center flex-wrap">
					<p className="inline-flex items-center gap-2 text-lg">
						Your points:{" "}
						<span>
							<span className="text-4xl font-medium inline-flex items-center gap-2">
								<Gift size={32} /> 120
							</span>{" "}
							<span className="text-sm font-medium">Points</span>
						</span>
					</p>

					<button
						type="button"
						className="p-2 text-xs rounded-full transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white flex items-center gap-1"
					>
						<ShoppingCart size={12} /> Buy More Points
					</button>
				</div>
			</div>
			<p className="text-sm text-center p-2 bg-primary/20 max-w-[95%] mx-auto">
				You can also earn points by adding friends, you get 10 AddMeUp points
				for every friend you add.
			</p>
		</div>
	);
}

function RecentTransactions() {
	return (
		<div>
			<h2 className="text-xl font-medium">Recent Transactions</h2>
		</div>
	);
}
