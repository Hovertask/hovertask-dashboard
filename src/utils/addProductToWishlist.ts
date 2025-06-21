import { toast } from "sonner";
import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default function addProductToWishlist(id: string) {
	toast.promise(
		() =>
			new Promise((resolve, reject) => {
				fetch(apiEndpointBaseURL + `/wishlists/add/${id}`, {
					method: "post",
					headers: {
						authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					},
				})
					.then(resolve)
					.catch(reject);
			}),
		{
			loading: "Please wait...",
			success: "Product added to wishlist successfully!",
			error: "Failed to add product to wishlist!",
		},
	);
}
