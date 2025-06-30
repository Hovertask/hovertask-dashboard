import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import PaymentOptionCard from "./components/PaymentOptionCard";
import paymentOptions from "./utils/paymentOptions";
import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../types";
import SellerInfoAside from "../../shared/components/SellerInfoAside";

export default function ChoosePaymentMethodPage() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="px-4 py-10 space-y-12 bg-white shadow min-h-full lg:max-w-[573px] overflow-x-hidden">
				<div className="flex gap-3">
					<Link className="mt-1" to="/become-a-member">
						<ArrowLeft />
					</Link>
					<div className="space-y-1">
						<h1 className="text-xl font-medium">
							Choose An Online Payment Method
						</h1>
						<p className="text-sm text-zinc-500">
							Select how you'd like to pay online
						</p>
					</div>
				</div>

				<div className="space-y-3">
					{paymentOptions.map((option) => (
						<PaymentOptionCard key={option.title} {...option} />
					))}
				</div>
			</div>

			<SellerInfoAside {...authUser} hideChatBtn showSafetyTips />
		</div>
	);
}
