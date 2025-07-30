import { ArrowLeft, Copy } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import type { AuthUserDTO } from "../../../types";

export default function ReferAndEarnPage() {
	const referralCode = useSelector<{ auth: { value: AuthUserDTO } }, string>(
		(state) => state.auth.value.referral_code,
	);
	const refLink = `https://hovertask.com/signup/?ref=${referralCode}`;

	async function copyRefLink() {
		try {
			await window.navigator.clipboard.writeText(refLink);
			toast.success("Copied!");
		} catch {
			toast.error("failed to copy!");
		}
	}

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md space-y-6 overflow-hidden min-h-full rounded-3xl">
				<div className="flex gap-4 flex-1 bg-gradient-to-r from-white via-primary/20 to-white px-4 pt-4">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="flex items-center justify-center flex-1 max-sm:flex-wrap max-sm:p-4 space-y-4">
						<img
							src="/images/Free_Photo___Happy_mixed_race_friendly_people_embrace_each_other-removebg-preview 1.png"
							alt=""
						/>
						<h1 className="text-3xl text-center font-medium text-primary">
							Refer & Earn <br /> Big
						</h1>
					</div>
				</div>

				<div className="p-6 space-y-6">
					<p className="p-4">
						Invite your friends, family, or colleagues to join our platform
						using your unique referral link. Each successful referral puts money
						directly into your wallet.
					</p>
					<p>
						The more people you refer, the more you earn. There's no limit to
						how much you can make through referrals.
					</p>

					<div>
						<h3 className="font-medium">How It Works</h3>
						<ol className="list-decimal list-inside">
							<li>Copy your unique referral link.</li>
							<li>
								Share link across your social media, email, or messaging apps.
							</li>
							<li>
								Earn <span className="font-medium">₦500</span> rewards every
								time someone signs up and completes their first task or makes a
								purchase.
							</li>
						</ol>
					</div>

					<div className="flex gap-x-4 gap-y-1 max-sm:flex-wrap items-center">
						<span className="font-medium">My Referral Link:</span>
						<span className="flex p-2 border border-zinc-400 rounded-full gap-4 text-sm">
							<span className="bg-primary/20 p-2 rounded-full text-primary">
								{refLink}
							</span>
							<button
								onClick={copyRefLink}
								type="button"
								className="flex gap-2 items-center text-primary transition-all active:scale-95 hover:bg-primary/20 px-2 py-1 rounded-full"
							>
								<Copy size={12} /> Copy
							</button>
						</span>
					</div>

					<div className="flex gap-x-4 flex-wrap gap-y-2 items-center">
						<div className="flex flex-col gap-1 bg-slate-200/80 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
							<span className="font-medium">3</span>
							<small>Referred Users</small>
						</div>
						<div className="flex flex-col gap-1 bg-slate-200/80 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
							<span className="font-medium">₦1,500.00</span>
							<small>Total Earnings</small>
						</div>
						<button
							type="button"
							className="px-4 py-3 rounded-xl text-sm transition-all active:scale-95 bg-primary text-white"
						>
							Withdraw Earnings
						</button>
					</div>

					<p>
						Turn your network into a source of consistent income. Start
						referring today and watch your earnings grow!
					</p>
				</div>
			</div>
		</div>
	);
}
