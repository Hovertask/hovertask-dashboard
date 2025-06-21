import { useEffect, useState } from "react";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";

export default function useReviews(productId: string) {
	const [reviews, setReviews] = useState<any[] | null>(null);

	useEffect(() => {
		(async function getReviews() {
			try {
				const response = await fetch(
					apiEndpointBaseURL + `/reviews/reviews/${productId}`,
				);
				const { reviews } = await response.json();

				setReviews(reviews);
			} catch (error) {
				console.error(error);
				setTimeout(getReviews, 5000);
			}
		})();
	}, []);

	return reviews;
}
