import { useEffect, useState } from "react";
import type { AuthUserDTO } from "../../types";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";

const sellersCache = new Map<string, AuthUserDTO>();

export default function useSeller(productId: string) {
	const [seller, setSeller] = useState<AuthUserDTO | null>(
		sellersCache.get(productId) || null,
	);

	useEffect(() => {
		if (!seller) {
			async function fetchSellerInfo() {
				try {
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
					setSeller(data.user);
					sellersCache.set(productId, data.user);
				} catch {
					fetchSellerInfo();
				}
			}

			fetchSellerInfo();
		}
	}, [productId, seller]);

	return seller;
}
