import EarnByResellingModal from "../components/EarnByResellingModal";
import EarningOptionCard from "./components/EarningOptionCard";
import earningOptions from "./utils/earningOptions";
import Benefits from "./components/Benefits";
import Overview from "./components/Overview";
import Banner from "./components/Banner";

export default function Earn() {
	return (
		<div className="max-w-[724px] gap-4 h-full">
			<div className="bg-white shadow p-4 pt-12 space-y-12 min-h-full">
				<Banner />

				<div className="space-y-4 bg-gradient-to-r from-white via-[#C8D3FB]/25 to-white rounded-3xl p-6">
					{earningOptions.map((option) => (
						<EarningOptionCard key={option.title} {...option} />
					))}
				</div>

				<div className="sm:grid grid-cols-2 p-4 gap-4 gap-y-8 shadow-lg shadow-zinc-100 rounded-3xl">
					<Benefits />
					<Overview />
				</div>

				<EarnByResellingModal />
			</div>
		</div>
	);
}
