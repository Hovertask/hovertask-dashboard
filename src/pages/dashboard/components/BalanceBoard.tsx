import { ChevronDown, Wallet } from "lucide-react";
import { Link } from "react-router";

export default function BalanceBoard({ balance }: { balance?: number }) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-[18.66px]">Total Balance</span>
				<button
					type="button"
					className="flex items-center gap-1 px-2 py-1 border-b rounded-full border-gray-600 font-light text-[9.42px]"
				>
					This Week
					<ChevronDown size={12} />
				</button>
			</div>

			<div className="flex items-center gap-12 flex-wrap">
				<div className="text-[34.67px] font-medium">
					₦{balance?.toFixed(2).toLocaleString()}
				</div>
				<div className="flex gap-6 text-sm flex-wrap font-medium">
					<Link
						to="/fund-wallet"
						className="flex items-center gap-2 px-[18.5px] py-[14px] text-white bg-primary rounded-full hover:bg-primary/80 transition-colors"
					>
						<Wallet size={16} /> Fund
					</Link>
					<Link
						to="/withdraw"
						className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-full transition-colors hover:bg-primary/10"
					>
						<Wallet size={16} /> Withdraw
					</Link>
				</div>
			</div>

			<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-[#DAE2FF] p-8 rounded-2xl">
				<div className="space-y-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-[13.87px]">Earned</span>
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-1 border-b rounded-full border-gray-600 font-light text-[9.42px]"
						>
							This Week
							<ChevronDown size={12} />
						</button>
					</div>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Pending</p>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Spent</p>
					<p className="text-[20.8px] font-medium">
						₦ {balance?.toFixed(2).toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}
