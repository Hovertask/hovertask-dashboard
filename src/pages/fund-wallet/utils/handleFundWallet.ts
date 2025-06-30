import { toast } from "sonner";
import initiateFundWalletTransaction from "../../../shared/utils/initiateWalletTransaction";
import verifyFundWalletTransaction from "../../../shared/utils/verifyFundWalletTransaction";

export default function handleFundWallet(info: {
	email: string;
	amount: number;
}) {
	toast.promise(
		(): Promise<string> =>
			new Promise((resolve, reject) => {
				initiateFundWalletTransaction(info)
					.then(response => {
						if (!response.status)
							return reject("We could not initialize the transaction. Try again soon.");

						const paymentTab = window.open(
							response.data.authorization_url,
							"_blank",
						);

						if (!paymentTab) reject("Please allow popups for this website");
						else
							verifyFundWalletTransaction(response.data.reference, () => {
								paymentTab.close();
								resolve("Payment confirmed!");
							});
					})
					.catch(() => reject("An error occurred. Please try again later."));

			}),
		{
			loading: "Processing payment. Please wait...",
			error: (e: string) => e,
			success: (e: string) => e,
		},
	);
}
