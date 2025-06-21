import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getProductsCategories(): Promise<{ id: string, name: string }[]> {
	return await (
		await (
			await fetch(`${apiEndpointBaseURL}/categories/all-categories`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			})
		).json()
	).map(({ id, name }: { id: string, name: string }) => {
		return { key: id, label: name };
	});
}
