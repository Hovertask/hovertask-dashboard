import { toast } from "sonner";
import initiateFundWalletTransaction from "../../../shared/utils/initiateWalletTransaction";

export default function handleFundWallet(info: {
  email: string;
  amount: number;
  type: string;
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

            if (!paymentTab) {
              reject("Please allow popups for this website");
            } else {
              // At this point, Paystack takes over. 
              // After payment, user will be redirected to your callback route.
              resolve("Redirecting to payment...");
            }
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
