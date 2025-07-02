import { Megaphone, ArrowLeft, Hexagon } from "lucide-react";
import { Link } from "react-router";
import EngagementOptions from "./components/EngagementOptions";

export default function EngagementTasks() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="space-y-16 overflow-hidden min-h-full rounded-2xl mt-4 p-4">
				<Hero />

				<div className="space-y-6">
					<div className="max-w-sm mx-auto flex items-center gap-4 p-4 rounded-3xl border-b-2 border-primary overflow-x-auto">
						<Link
							to="/advertise"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all text-primary"
						>
							<Hexagon className="w-4 h-4" /> Advert Tasks
						</Link>
						<button
							type="button"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all bg-primary text-white"
						>
							<Megaphone className="w-4 h-4" /> Engagement Tasks
						</button>
					</div>

					<p className="text-sm px-4">
						Boost your social media presence by engaging users for meaningful
						actions like joining groups, sharing campaigns, or following your
						accounts
					</p>
				</div>

				<EngagementOptions />
			</div>
		</div>
	);
}

function Hero() {
	return (
		<div className="bg-gradient-to-r from-white via-primary/30 to-white px-4 pt-4 rounded-2xl">
			<div className="flex gap-6 max-mobile:gap-4">
				<Link to="/advertise">
					<ArrowLeft />
				</Link>

				<div className="flex justify-center items-center gap-6">
					<div>
						<img
							src="/images/Premium_Photo___Composition_with_smartphone_used_for_digital_shopping_and_online_ordering-removebg-preview 3.png"
							width={230}
							alt=""
						/>
					</div>
					<h1 className="text-2xl text-primary text-center">
						Advertise on <br /> Social Media
					</h1>
				</div>
			</div>
		</div>
	);
}
