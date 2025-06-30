import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getProducts() {
	return await (
		await (
			await fetch(`${apiEndpointBaseURL}/products/show-all-product`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			})
		).json()
	);
}
