import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function getAuthUser() {
  let authToken = localStorage.getItem("auth_token");

  // 1️⃣ Accept token from URL on first login
  if (!authToken) {
    const urlToken = new URLSearchParams(window.location.search).get("token");

    if (urlToken) {
      authToken = urlToken;
      localStorage.setItem("auth_token", urlToken);

      // Clean URL (remove ?token=xxx)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // 2️⃣ No token → just return null (DON’T redirect)
  if (!authToken) {
    return null;
  }

  try {
    const response = await fetch(`${apiEndpointBaseURL}/dashboard/user`, {
      headers: {
        authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    // 3️⃣ Token expired or invalid → clear token and return null
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      return null;
    }

    // 4️⃣ Other fetch errors
    if (!response.ok) {
      console.error("Error fetching user:", await response.clone().json().catch(() => null));
      return null;
    }

    // 5️⃣ Success — user returned
    return await response.json();
  } catch (error) {
    console.error("Network or server error:", error);
    return null;
  }
}
