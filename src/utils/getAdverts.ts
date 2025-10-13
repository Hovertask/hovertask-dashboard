import type { Advert } from "../../types";
import apiEndpointBaseURL from "./apiEndpointBaseURL";
import getAuthorization from "./getAuthorization";

export default async function getAdverts() {
	const response = await fetch(`${apiEndpointBaseURL}/adverts/show-all-advert`, {
		headers: {
			authorization: getAuthorization(),
		},
	});

	return (await response.json()).data as Advert[];
}
