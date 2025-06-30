import type { TransactionInitializationInfo } from "../../types";
import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function initiateTransaction(
	info: TransactionInitializationInfo,
) {
	const response = await fetch(
		`${apiEndpointBaseURL}/wallet/initialize-payment`,
		{
			method: "post",
			body: JSON.stringify(info),
			headers: {
				authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				"content-type": "application/json",
			},
		},
	);
	const data = await response.json();
	return data.data;
}
