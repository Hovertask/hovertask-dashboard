import { useEffect, useState } from "react";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import { AuthUserDTO } from "../../types";
import getAuthorization from "../utils/getAuthorization";

const sellersCache = new Map<string, AuthUserDTO>();

export default function useSeller(productId: string) {
	const [seller, setSeller] = useState<AuthUserDTO | null>(
		sellersCache.get(productId) || null,
	);

	useEffect(() => {
		if (!seller) {
			async function fetchSellerInfo() {
				const response = await fetch(
					`${apiEndpointBaseURL}/products/contact-seller/${productId}`,
					{
						headers: {
							authorization: getAuthorization(),
						},
						method: "post",
					},
				);

				const data = await response.json();

				sellersCache.set
					.then(
						(data) => (
							setSeller(data.user), sellersCache.set(productId, data.user)
						),
					)
					.catch(fetchSellerInfo);
			}

			fetchSellerInfo();
		}
	}, [productId, seller]);

	return seller;
}
