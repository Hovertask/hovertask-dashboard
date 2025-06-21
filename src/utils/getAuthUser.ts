import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getAuthUser() {
	let authToken = localStorage.getItem("auth_token");

	if (!authToken) {
		authToken = new URLSearchParams(window.location.search).get("token");
		authToken && localStorage.setItem("auth_token", authToken);
	}

	if (!authToken)
		return window.location.replace("https://hovertask-pi.vercel.app/signin");

	const response = await fetch(apiEndpointBaseURL + "/dashboard/user", {
		headers: {
			authorization: `Bearer ${authToken}`,
		},
	});

	return await response.json();
}
