import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getProducts() {
	return await (
		await (
			await fetch(apiEndpointBaseURL + "/products/show-all-product", {
				headers: {
					authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			})
		).json()
	).map((product: any) => {
		product.images = product.product_images.map(
			(image: any) => image.file_path,
		);

		delete product.product_images;
		return product;
	});
}
