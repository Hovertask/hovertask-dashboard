import { toast } from "sonner";
import getAuthorization from "../../utils/getAuthorization";

export default async function verifyFundWalletTransaction(
  transactionId: string,
): Promise<any> {
  try {
    const res = await fetch(
      `https://backend.hovertask.com/api/wallet/verify-payment/${encodeURIComponent(transactionId)}`,
      {
        method: "GET", // explicit
        headers: {
          Authorization: getAuthorization(), // should be "Bearer <token>"
          Accept: "application/json",
        },
      },
    );

    // Try parse JSON, but guard if body is empty or invalid
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Backend returns { success:false, message: '...' } on error per updated backend
      toast.error(data.message || "Payment verification failed");
      return { success: false, ...data };
    }

    // res.ok true: backend returns { success:true, message: "", data: ... }
    if (data.success === true || data.data) {
      // success case
      return { success: true, ...data };
    }

    // Unexpected shape — show user friendly message
    toast.error(data.message || "Payment verification returned unexpected response");
    return { success: false, ...data };
  } catch (err) {
    // Network or JSON parse error
    const m = err instanceof Error ? err.message : "Unknown error";
    toast.error(`Failed to verify payment: ${m}`);
    return { success: false, message: m };
  }
}
