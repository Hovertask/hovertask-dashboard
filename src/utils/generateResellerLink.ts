import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default function generateResellerLink(id: string) {
	return new Promise((resolve, reject) => {
		fetch(apiEndpointBaseURL + `/products/reseller-link/${id}`, {
			method: "post",
			headers: {
				authorization: `Bearer ${localStorage.getItem("auth_token")}`,
			},
		})
			.then((response) => response.json())
			.then(resolve)
			.catch(reject);
	});
}
