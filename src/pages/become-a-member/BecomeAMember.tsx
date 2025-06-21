import { useDisclosure } from "@heroui/react";
import PaymentMethodModal from "./components/PaymentMethodModal";

export default function MembershipPage() {
	const modalProps = useDisclosure();

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="px-4 py-10 space-y-12 bg-white shadow min-h-full lg:max-w-[573px] overflow-x-hidden">
				<div className="max-w-sm mx-auto flex max-xs:flex-wrap gap-2 items-center justify-center my-4">
					<img
						src="/images/You_Won_t_Blog_Forever-removebg-preview 1.png"
						width={180}
						alt=""
					/>
					<h1 className="text-2xl">Become a Member Today</h1>
				</div>

				<div className="px-4 py-6 bg-white shadow-md rounded-3xl space-y-4 text-xs">
					<h3 className="font-medium">
						Turn Your Social Media Into Your Cash Machine
					</h3>
					<p>
						Earn daily income by completing social media tasks like like,
						follows, comments, shares, and retweets
					</p>
					<p>For a one-time fee of ₦1,000 enjoy liftime benfits:</p>
					<h4>What you get:</h4>
					<ul className="list-disc list-outside ml-4 space-y-2">
						<li>
							Daily Income: Get paid for tasks like liking, following, or
							sharing posts
						</li>
						<li>
							Referral Bonuses: Earn ₦500 commision per referral and 20%
							commision on purchases of likes, followers, shares
						</li>
						<li>
							Discounted Airtime/Data: Buy at 10%-15% off and resell for profit
						</li>
						<li>
							Sell your poducts: Reach thousands of buyers by listing products
							on Marketplace Pro
						</li>
					</ul>
					<p>
						Click below to activate your membership and unlock endless
						opportunities
					</p>
					<p className="font-medium">Start Earning Today</p>

					<div className="bg-primary/15 flex items-center justify-between gap-2 px-6 py-2 rounded-full max-w-sm">
						<span className="text-xs">Membership Fee</span>
						<span className="text-2xl">₦1,000</span>
						<button
							type="button"
							onClick={modalProps.onOpen}
							className="bg-primary text-white px-4 py-3 rounded-full font-medium text-sm"
						>
							Continue
						</button>
					</div>
				</div>
			</div>

			<PaymentMethodModal {...modalProps} />
		</div>
	);
}
