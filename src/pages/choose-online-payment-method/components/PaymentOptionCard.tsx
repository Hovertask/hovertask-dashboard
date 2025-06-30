import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../../types";
import initiateFundWalletTransaction from "../../../shared/utils/initiateWalletTransaction";
import verifyFundWalletTransaction from "../../../shared/utils/verifyFundWalletTransaction";
import { toast } from "sonner";

export default function PaymentOptionCard(props: {
	icon: React.ReactNode;
	title: string;
	description: string;
	buttonText: string;
}) {
	const { icon, title, description, buttonText } = props;
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	function initiatePaymentTransaction() {
		toast.promise(
			() =>
				new Promise((resolve, reject) => {
					initiateFundWalletTransaction({
						email: authUser.email,
						amount: 1000,
					})
						.then((res) => res.json())
						.then((response) => {
							const newWindow = window.open(
								response.data.authorization_url,
								"_blank",
							);

							if (!newWindow) reject("Please allow popups for this website");
							else {
								resolve(undefined);
								verifyFundWalletTransaction(response.data.reference);
							}
						})
						.catch(reject);
				}),
			{
				loading: "Initiating transaction...",
				error: (e: string) => e,
				success: "Transaction initialized successfully!",
			},
		);
	}

	return (
		<div className="flex items-center gap-4 border-1 border-primary rounded-3xl py-4 px-4 mobile:px-8">
			<div>{icon}</div>
			<div className="flex-1">
				<p className="text-lg font-medium">{title}</p>
				<p className="text-sm text-gray-500">{description}</p>
			</div>
			<button
				type="button"
				onClick={initiatePaymentTransaction}
				className="bg-primary text-sm px-4 py-2 rounded-xl text-white"
			>
				{buttonText}
			</button>
		</div>
	);
}
