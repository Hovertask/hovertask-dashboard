import { ArrowLeft, Hexagon, Megaphone } from "lucide-react";
import { Link } from "react-router";
import LinkAccountsModal from "../components/LinkAccountsModal";
import TasksTabs from "./components/TasksTabs";

export default function Tasks() {
	return (
		<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
			<div className="bg-white shadow p-4 py-12 space-y-12 min-h-full">
				<div className="flex">
					<div className="flex gap-4 flex-1">
						<Link className="mt-1" to="/earn">
							<ArrowLeft />
						</Link>

						<div className="space-y-2">
							<h1 className="text-xl font-medium">
								Perform Tasks or Post Adverts to Earn Money
							</h1>
							<p className="text-sm text-secondary">
								Pick from a variety of tasks or start posting adverts for
								rewards.
							</p>
						</div>
					</div>

					<div className="max-sm:hidden">
						<img
							src="/images/Media_Sosial_Pictures___Freepik-removebg-preview 2.png"
							width={194}
							alt=""
							className="-mt-12 -translate-x-4"
						/>
					</div>
				</div>

				<div className="space-y-6">
					<div className="w-fit mx-auto flex items-center gap-4 p-4 bg-primary rounded-3xl border-b border-b-black overflow-x-auto">
						<button
							type="button"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all bg-white text-primary"
						>
							<Hexagon size={14} /> Perform Tasks
						</button>
						<Link
							to="/earn/adverts"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all"
						>
							<Megaphone size={14} /> Post Adverts to Earn Money
						</Link>
					</div>

					<TasksTabs />
					<LinkAccountsModal />
				</div>
			</div>
		</div>
	);
}
