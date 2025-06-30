import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import getAuthorization from "../../utils/getAuthorization";

export default async function verifyFundWalletTransaction(
	transactionId: string,
	cb?: () => unknown,
) {
	const response = await fetch(
		`${apiEndpointBaseURL}/wallet/verify-payment/${transactionId}`,
		{ headers: { authorization: getAuthorization() } },
	);
	const data = await response.json();
	// Check for success status, if true, call the callback
	if (data.success && cb) cb();
}
