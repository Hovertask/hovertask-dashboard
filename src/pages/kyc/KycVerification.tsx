import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import SellerInfoAside from "../../shared/components/SellerInfoAside";
import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../types";

export default function KycVerification() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<div className="mobile:flex gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 max-w-[724px] space-y-6 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-2xl">KYC Verification</h1>
						<p className="text-xs font-light text-secondary">
							Verifying your KYC (Know Your Customer) is quick and easy! Follow
							these three simple steps to unlock full access to sell products
							and services securely on Hovertask Marketplace.
						</p>
					</div>
				</div>

				<div>
					<div className="bg-[#EFF2FC] rounded-2xl p-6">
						<h2 className="mb-4 text-black">How to get verified</h2>

						<div className="space-y-3">
							<button
								type="button"
								className="flex justify-between items-center gap-4 p-2 text-xs font-medium w-fit border border-primary text-primary rounded-md hover:bg-primary/20 transition"
							>
								<span>Step 1: Submit Your Personal Details</span>
								<ChevronDown size={12} />
							</button>

							<button
								type="button"
								className="flex justify-between items-center gap-4 p-2 text-xs font-medium w-fit border border-primary text-primary rounded-md hover:bg-primary/20 transition"
							>
								<span>Step 2: Upload a Valid ID Document</span>
								<ChevronDown size={12} />
							</button>

							<button
								type="button"
								className="flex justify-between items-center gap-4 p-2 text-xs font-medium w-fit border border-primary text-primary rounded-md hover:bg-primary/20 transition"
							>
								<span>
									Step 3: Take a Live Selfie for Identity Verification
								</span>
								<ChevronDown size={12} />
							</button>
						</div>
					</div>
				</div>

				<div className="ml-12 space-y-6">
					<div className="text-xs font-light text-gray-800 space-y-2">
						<p>
							<span>✅</span>
							<span className="font-medium">What's Next?</span>
						</p>
						<ul className="space-y-1 list-none">
							<li className="flex items-start">
								<span className="text-primary">🔷</span>
								<span>
									Your KYC verification will be reviewed within 24–48 hours.
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-primary">🔷</span>
								<span>
									Once approved, you'll receive a confirmation notification.
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-primary">🔷</span>
								<span>
									After verification, you can list products, withdraw funds, and
									enjoy full marketplace features!
								</span>
							</li>
						</ul>
						<p>
							Need help? Contact{" "}
							<Link
								to="/support"
								className="text-primary underline hover:text-primary/80"
							>
								Hovertask Support
							</Link>{" "}
							for assistance. 🚀
						</p>
					</div>

					<div className="flex space-x-4">
						<Link
							to="/kyc/start"
							className="bg-primary text-white px-6 py-1.5 text-xs rounded-full hover:bg-primary/80 transition"
						>
							Continue
						</Link>
						<button
							type="button"
							className="border border-primary text-primary px-6 py-1.5 text-xs rounded-full hover:bg-primary/20 transition"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<SellerInfoAside {...{ ...authUser, hideChatBtn: true }} />
		</div>
	);
}
