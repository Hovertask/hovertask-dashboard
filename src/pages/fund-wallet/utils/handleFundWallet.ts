import { toast } from "sonner";
import initiateFundWalletTransaction from "../../_shared/utils/initiateWalletTransaction";
import verifyFundWalletTransaction from "../../_shared/utils/verifyFundWalletTransaction";

/** Submit handler for fund-wallet form */
export default function handleFundWallet(info: {
	email: string;
	amount: number;
}) {
	// Display transaction progress in a toast for better UX.
	toast.promise(
		(): Promise<string> =>
			// biome-ignore lint/suspicious/noAsyncPromiseExecutor: Allow async callback in promise
			new Promise(async (resolve, reject) => {
				try {
					// Initiate a transaction, and get the transaction info.
					const response = await initiateFundWalletTransaction(info);

					// Fund wallet transaction initialization should return a success status.
					if (!response.status)
						reject("We could not initialize the transaction. Try again soon.");
					else {
						// Popup a new tab with the transaction url.
						// Payment is processed by PayStack and the user will be redirected
						// to the appropriate page. However, if the transaction is verified
						// before the redirection, the tab can be closed.
						const paymentTab = window.open(
							response.data.authorization_url,
							"_blank",
						);

						if (!paymentTab) reject("Please allow popups for this website");
						else
							verifyFundWalletTransaction(response.data.reference, () => {
								// Close payment tab once transaction is successful;
								paymentTab.close();
								resolve("Payment confirmed!");
							});
					}
				} catch {
					reject("An error occurred. Please try again later.");
				}
			}),
		{
			loading: "Processing payment. Please wait...",
			error: (e: string) => e,
			success: (e: string) => e,
		},
	);
}
