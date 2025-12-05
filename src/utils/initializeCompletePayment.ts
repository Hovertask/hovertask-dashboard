import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";

export default async function initializePayment({
  type,
  advertId,
}: {
  type: "task" | "advert" | "deposit" | "membership";
  advertId: number;
}) {
  try {
    const response = await fetch(`${apiEndpointBaseURL}/wallet/initialize-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({
        type,
        advert_id: advertId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Failed to initialize payment.");
    }

    const result = await response.json();

    const authorizationUrl =
      result?.data?.data?.authorization_url || result?.data?.authorization_url;

    if (!authorizationUrl) {
      throw new Error("Authorization URL not found in response.");
    }

    return authorizationUrl;
  } catch (error: any) {
    console.error("Payment initialization failed:", error);
    throw error;
  }
}
