import getAuthorization from "../../utils/getAuthorization";

export default async function verifyFundWalletTransaction(
	transactionId: string,
	cb?: () => unknown,
) {
	const response = await fetch(
		`https://backend.hovertask.com/api/wallet/verify-payment/${transactionId}`,
		{ headers: { authorization: getAuthorization() } },
	);
	const data = await response.json();
	// Check for success status, if true, call the callback
	if (data.success && cb) cb();
}
