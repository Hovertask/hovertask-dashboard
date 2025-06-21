import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import EarnByResellingModal from "./components/EarnByResellingModal";
import EarningOptionCard from "./components/EarningOptionCard";
import earningOptions from "./utils/earningOptions";

export default function Earn() {
	return (
		<div className="mobile:max-w-[724px] mobile:grid gap-4 min-h-full">
			<div className="bg-white shadow p-4 pt-12 space-y-12 min-h-full">
				<div className="bg-primary/20 p-6 rounded-3xl relative">
					<div className="flex gap-4 max-w-xs">
						<Link className="mt-1" to="/">
							<ArrowLeft />
						</Link>

						<div className="space-y-2">
							<h1 className="text-xl">Choose Your Earning Path</h1>
							<p className="text-[#5E5E62] font-light">
								Select how want to earn and start making money today
							</p>
						</div>
					</div>

					<div className="max-w-md flex justify-center">
						<img
							width={138}
							src="/images/3D_rendering_of_new_1000_Nigerian_naira_notes_flying_in_different_angles_and_orientations_isolated_on_transparent_background-removebg-preview 1.png"
							alt=""
						/>
					</div>

					<div className="absolute max-mobile:hidden right-4 -top-16">
						<img
							src="/images/Social_Media_-_Sandrin_Design_-_11_-_sandrin__-removebg-preview 1.png"
							width={280}
							alt=""
						/>
					</div>
				</div>

				<div className="space-y-4 bg-gradient-to-r from-white via-[#C8D3FB]/25 to-white rounded-3xl p-6">
					{earningOptions.map((option) => (
						<EarningOptionCard key={option.title} {...option} />
					))}
				</div>

				<div className="sm:grid grid-cols-2 p-4 gap-4 gap-y-8 shadow-lg shadow-zinc-100 rounded-3xl">
					<BenefitOfPerformingTasks />
					<OverviewOfCommissionsFromReselling />
				</div>

				<EarnByResellingModal />
			</div>
		</div>
	);
}

function BenefitOfPerformingTasks() {
	return (
		<div>
			<h3 className="font-medium px-8 py-3 w-fit rounded-[60%] text-primary border border-primary text-xs mb-2">
				Benefits of Performing Tasks
			</h3>

			<div className="text-[8.92px] font-light text-[#000000D9]">
				<p>Quick and Easy Earnings:</p>
				<ul className="list-disc ml-4">
					<li>Tasks are easy to complete and require minimal effort.</li>
					<li>
						Suitable for all skill levels, from beginner to experienced users.
					</li>
				</ul>
				<p>Flexible Schedule:</p>
				<ul className="list-disc ml-4">
					<li>Complete tasks at your own pace and on your on time.</li>
					<li>No fixed working hours, providing total freedom.</li>
				</ul>
				<p>Instant Rewards</p>
				<ul className="list-disc ml-4">
					<li>Get paid as soon as tasks are verified.</li>
					<li>Enjoy immediate feedback on your efforts.</li>
				</ul>
				<p>Accessible Opportunities</p>
				<ul className="list-disc ml-4">
					<li>
						Available to anyone with a smartphone or computer, and internet
						connection.
					</li>
					<li>No special equipment or training required.</li>
				</ul>
			</div>
		</div>
	);
}

function OverviewOfCommissionsFromReselling() {
	return (
		<div>
			<h3 className="font-medium px-8 py-3 w-fit rounded-[60%] text-primary border border-primary text-xs mb-2">
				Overview of Commisins from Reslling
			</h3>

			<div className="text-[8.92px] font-light text-[#000000D9]">
				<p>High Commission Rates:</p>
				<ul className="list-disc ml-4">
					<li>
						Earn competitive commissions on each productsold, with rates ranging
						from 10% to 50% depending on the product.
					</li>
				</ul>
				<p>Wide Product Selection:</p>
				<ul className="list-disc ml-4">
					<li>
						Access a diverse catalog of high-demanding products across
						categories such as fashion, electronics, and home essentials.
					</li>
				</ul>
				<p>Flexible Earning Potential:</p>
				<ul className="list-disc ml-4">
					<li>The more you sell, the more you earn - no earning caps!</li>
					<li>Leverage your network to maximize income.</li>
				</ul>
				<p>Simple Reselling Process:</p>
				<ul className="list-disc ml-4">
					<li>Share a unique affiliate link to promote products.</li>
					<li>No need to manage inventory or handle logistics.</li>
				</ul>
			</div>
		</div>
	);
}
