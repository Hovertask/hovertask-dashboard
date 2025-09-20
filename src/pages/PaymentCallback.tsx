import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import verifyFundWalletTransaction from "../shared/utils/verifyFundWalletTransaction";
import MembershipSuccessModal from "./become-a-member/components/MembershipSuccessModal";

export default function PaymentCallback() {
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");
    if (reference) {
      verifyFundWalletTransaction(reference, () => {
        toast.success("Payment verified and wallet funded!");
        setShowSuccessModal(true);
      });
    } else {
      toast.error("No payment reference found.");
      // Optionally, you can redirect or show an error modal here
    }
  }, [location]);

  return (
    <>
      <div className="p-8 text-center">Processing payment...</div>
      {showSuccessModal && <MembershipSuccessModal />}
    </>
  );
}
