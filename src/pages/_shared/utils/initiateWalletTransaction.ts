import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../utils/getAuthorization";

export default async function initiateFundWalletTransaction(info: {
	email: string;
	amount: number;
}) {
	const response = await fetch(
		apiEndpointBaseURL + "/wallet/initialize-payment",
		{
			method: "post",
			body: JSON.stringify(info),
			headers: {
				authorization: getAuthorization(),
				"content-type": "application/json",
			},
		},
	);

	return (await response.json()).data;
}
