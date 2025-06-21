import { CheckCircle, LockIcon, Wallet } from "lucide-react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
} from "@heroui/react";
import { Link } from "react-router";

export default function MembershipPage() {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<div className="px-4 py-6 space-y-6 bg-white shadow min-h-full">
			<div className="max-w-sm mx-auto flex max-xs:flex-wrap gap-2 items-center justify-center my-4">
				<img
					src="/images/You_Won_t_Blog_Forever-removebg-preview 1.png"
					width={180}
					alt=""
				/>
				<h1 className="text-2xl font-medium">Become a Member Today</h1>
			</div>

			<div className="px-4 py-6 bg-white shadow-md rounded-3xl space-y-4">
				<h3 className="font-medium">
					Turn Your Social Media Into Your Cash Machine
				</h3>
				<p>
					Earn daily income by completing social media tasks like like, follows,
					comments, shares, and retweets
				</p>
				<p>For a one-time fee of ₦1,000 enjoy liftime benfits:</p>
				<h4>What you get:</h4>
				<ul className="list-disc list-outside ml-4 space-y-2">
					<li>
						Daily Income: Get paid for tasks like liking, following, or sharing
						posts
					</li>
					<li>
						Referral Bonuses: Earn ₦500 commision per referral and 20% commision
						on purchases of likes, followers, shares
					</li>
					<li>
						Discounted Airtime/Data: Buy at 10%-15% off and resell for profit
					</li>
					<li>
						Sell your poducts: Reach thousands of buyers by listing products on
						Marketplace Pro
					</li>
				</ul>
				<p>
					Click below to activate your membership and unlock endless
					opportunities
				</p>
				<p className="font-medium">Start Earning Today</p>

				<div className="bg-primary/15 flex items-center justify-between gap-2 px-6 py-2 rounded-full max-w-sm">
					<span className="text-xs">Membership Fee</span>
					<span className="font-semibold text-xl">₦1,000</span>
					<button
						onClick={onOpen}
						className="bg-primary text-white px-4 py-2 rounded-full text-sm"
					>
						Continue
					</button>
				</div>
			</div>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				size="xl"
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex items-center gap-2">
								<CheckCircle size={16} /> Payment Method
							</ModalHeader>
							<ModalBody className="space-y-2 mb-4">
								<p>Choose an online payment method</p>

								<div className="space-y-3">
									<Link
										to="/choose-online-payment-method"
										className="flex items-center gap-4 border-1 border-primary rounded-3xl p-4"
									>
										<div>
											<LockIcon size={32} className="text-primary" />
										</div>
										<div>
											<p className="text-lg font-medium">
												100% Secure Online Payment
											</p>
											<p className="text-sm text-gray-500">
												Pay securely using you MasterCard/Visa/Verve card. Bank
												Transfer via USSD or Internet Bank Transfer
											</p>
										</div>
									</Link>

									<Link
										to="#"
										className="flex items-center gap-4 border-1 border-primary rounded-3xl p-4"
									>
										<div>
											<Wallet size={32} className="text-primary" />
										</div>
										<div>
											<p className="text-lg font-medium">Pay With Wallet</p>
											<p className="text-sm text-gray-500">
												Pay with wallet balance.
											</p>
										</div>
									</Link>
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
