import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getAuthUser() {
	let authToken = localStorage.getItem("auth_token");

	// ✅ Check if token is passed via URL (first login redirect)
	if (!authToken) {
		authToken = new URLSearchParams(window.location.search).get("token");

		if (authToken) {
			localStorage.setItem("auth_token", authToken);

			// ✅ Clean the URL so token isn’t visible in address bar
			const cleanUrl = window.location.origin + window.location.pathname;
			window.history.replaceState({}, document.title, cleanUrl);
		}
	}

	// 🚨 If still no token, force re-login
	if (!authToken) {
		window.location.replace("https://hovertask.com/signin");
		return;
	}

	try {
		const response = await fetch(`${apiEndpointBaseURL}/dashboard/user`, {
			headers: {
				authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
		});

		// ❌ Token invalid or expired — log out
		if (response.status === 401) {
			localStorage.removeItem("auth_token");
			window.location.replace("https://hovertask.com/signin");
			return;
		}

		// ❌ Other unexpected errors
		if (!response.ok) {
			const errData = await response.json();
			console.error("Error fetching user:", errData);
			throw new Error(errData.message || "Unable to fetch user");
		}

		// ✅ Everything fine — return user data
		return await response.json();
	} catch (error) {
		console.error("Network or server error:", error);
		localStorage.removeItem("auth_token");
		window.location.replace("https://hovertask.com/signin");
	}
}
