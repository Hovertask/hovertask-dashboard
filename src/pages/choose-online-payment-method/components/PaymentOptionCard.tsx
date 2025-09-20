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
				new Promise<string>((resolve, reject) => {
					initiateFundWalletTransaction({
						email: authUser.email,
						amount: 1000,
					})
						.then((response) => {
							const data = response.data || response;
							console.log('Payment response:', data);
							const paymentData = data.data?.data;
							if (!paymentData || !paymentData.authorization_url) {
								reject("Payment gateway did not return a valid authorization URL.");
								return;
							}
							const newWindow = window.open(
								paymentData.authorization_url,
								"_blank",
							);

							if (!newWindow) {
								reject("Please allow popups for this website");
							} else {
								const msg = data.message ? String(data.message) : "Transaction initialized successfully!";
								resolve(msg);
								verifyFundWalletTransaction(paymentData.reference);
							}
						})
						.catch(reject);
				}),
			{
				loading: "Initiating transaction...",
				error: (e: any) => typeof e === "string" ? e : (e?.message || "An error occurred"),
				success: (msg: string) => msg,
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
