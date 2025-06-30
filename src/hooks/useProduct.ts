import { useEffect, useState } from "react";
import type { Product } from "../../types.d";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import useProducts from "./useProducts";
import getAuthorization from "../utils/getAuthorization";

const productCache = new Map<string, Product>();

export default function useProduct(id: string): Product | null {
	const { products } = useProducts();
	const [product, setProduct] = useState<Product | null>(
		productCache.get(id) ||
		products?.find((product) => (product.id === id)) ||
		null,
	);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (!product) {
			async function fetchProduct() {
				try {
					const response = await fetch(
						`${apiEndpointBaseURL}/products/show-product/${id}`,
						{
							headers: {
								authorization: getAuthorization(),
							},
						},
					);

					if (!response.ok) {
						toast.error(
							"We couldn't complete this request at the moment. Try again soon",
						);
						navigate("/marketplace");
						return;
					}

					const data = await response.json();
					if (!data.success) {
						toast.error(
							"The product you were looking for does not exist, or has been removed.",
						);
						navigate("/marketplace");
						return;
					}

					productCache.set(id, data.product);
					setProduct(product);
				} catch {
					toast.error(
						"We couldn't complete this request at the moment. Try again soon",
					);
					navigate("/marketplace");
				}
			}

			fetchProduct();
		}
	}, [product, products]);

	return product;
}
