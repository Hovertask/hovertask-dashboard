import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import verifyFundWalletTransaction from "../shared/utils/verifyFundWalletTransaction";
import MembershipSuccessModal from "./become-a-member/components/MembershipSuccessModal";

export default function PaymentCallback() {
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    (async function () {
      const params = new URLSearchParams(location.search);
      const reference = params.get("reference");
      if (!reference) {
        toast.error("No payment reference found.");
        return;
      }

      const result = await verifyFundWalletTransaction(reference);

      if (result && result.success) {
        toast.success("Payment verified and wallet funded!");
        setShowSuccessModal(true);
      } else {
        // Show backend message if there is one, or generic error
        toast.error(result?.message || "Payment verification failed");
      }
    })();
    // Only run on mount / when query changes
  }, [location.search]);

  return (
    <>
      <div className="p-8 text-center">Processing payment...</div>
      {showSuccessModal && <MembershipSuccessModal />}
    </>
  );
}
