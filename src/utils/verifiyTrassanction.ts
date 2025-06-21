import { toast } from "sonner";
import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default function verifyTransaction(transactionId: string) {
	toast.promise(
		() =>
			new Promise((resolve, reject): any => {
				fetch(`${apiEndpointBaseURL}/wallet/verify-payment/${transactionId}`, {
					method: "get",
					headers: {
						authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						"content-type": "application/json",
					},
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status) resolve(data.message);
						else
							reject(
								data.error || "An error occurred. Please try again later.",
							);
					})
					.catch((error) =>
						reject(
							error.message || "An error occurred. Please try again later.",
						),
					);
			}),
		{
			loading: "Verifying transaction...",
			error: (e: string) => e,
			success: "Transaction verified successfully!",
		},
	);
}
