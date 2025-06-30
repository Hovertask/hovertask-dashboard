import { ArrowLeft, Hexagon, Megaphone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import LinkAccountsModal from "./components/LinkAccountsModal";
import cn from "../../utils/cn";
import AvailableTasks from "../../shared/components/AvailableTasks";
import tasksCategories from "./utils/tasksCategories";

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

					<TasksTab />
					<LinkAccountsModal />
				</div>
			</div>
		</div>
	);
}

function TasksTab() {
	const [currentCategory, setCurrentCategory] =
		useState<(typeof tasksCategories)[number]["key"]>("social_media");

	return (
		<div className="space-y-6">
			<p className="text-xs text-center text-secondary max-w-[637px] mx-auto">
				Earn steady income by promoting businesses and top brands on your social
				media platforms. To qualify for posting adverts on Facebook, Instagram,
				Twitter or TikTok, your account must have a minimum if 1,000 followers.
			</p>

			<div className="flex gap-3 max-w-full overflow-x-auto items-center w-fit mx-auto border border-zinc-300 p-4 rounded-2xl">
				{tasksCategories.map((category) => (
					<button
						type="button"
						key={category.key}
						onClick={() =>
							setCurrentCategory(category.key as typeof currentCategory)
						}
						className={cn("p-2 rounded-lg text-xs whitespace-nowrap", {
							"bg-primary text-white transition-all active:scale-x-90":
								currentCategory === category.key,
							"text-secondary bg-zinc-300 border border-zinc-400":
								currentCategory !== category.key,
						})}
					>
						{category.label}
					</button>
				))}
			</div>

			<div className="flex justify-end max-w-[676px] mx-auto pr-8">
				<Link to="/earn/tasks-history" className="text-primary hover:underline">
					Check task history
				</Link>
			</div>

			<div>
				<img src="/images/Group 1000004395.png" alt="" />
			</div>

			<AvailableTasks filter={currentCategory} />
		</div>
	);
}
