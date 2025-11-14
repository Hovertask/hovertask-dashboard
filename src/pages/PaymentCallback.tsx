import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import verifyFundWalletTransaction from "../shared/utils/verifyFundWalletTransaction";

import MembershipSuccessModal from "./become-a-member/components/MembershipSuccessModal";
import TaskSuccessModal from "./payment-success-modals/TaskSuccessModal";
import AdvertSuccessModal from "./payment-success-modals/AdvertSuccessModal";
import WalletFundedSuccessModal from "./payment-success-modals/WalletFundedSuccessModal";

export default function PaymentCallback() {
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "membership" | "task" | "advert" | "wallet" | null
  >(null);

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
        toast.success("Payment verified!");

        const category = result.payment_category;

        // Assign modal based on payment category
        if (category === "membership") setModalType("membership");
        else if (category === "task") setModalType("task");
        else if (category === "advert") setModalType("advert");
        else if (category === "deposit") setModalType("wallet");

        setShowModal(true);
      } else {
        toast.error(result?.message || "Payment verification failed.");
      }
    })();
  }, [location.search]);

  return (
    <>
      <div className="p-8 text-center">Processing payment...</div>

      {showModal && modalType === "membership" && (
        <MembershipSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && modalType === "task" && (
        <TaskSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && modalType === "advert" && (
        <AdvertSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && modalType === "wallet" && (
        <WalletFundedSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
