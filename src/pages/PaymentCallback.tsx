import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import verifyFundWalletTransaction from "../shared/utils/verifyFundWalletTransaction";
import { setAuthUser } from "../redux/slices/auth";
import getAuthUser from "../utils/getAuthUser";

import MembershipSuccessModal from "./become-a-member/components/MembershipSuccessModal";
import TaskSuccessModal from "./payment-success-modals/TaskSuccessModal";
import AdvertSuccessModal from "./payment-success-modals/AdvertSuccessModal";
import WalletFundedSuccessModal from "./payment-success-modals/WalletFundedSuccessModal";

export default function PaymentCallback() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"membership" | "task" | "advert" | "wallet" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      try {
        // 1️⃣ Hydrate the user immediately
        const user = await getAuthUser();
        dispatch(setAuthUser(user));

        // 2️⃣ Parse the payment reference
        const params = new URLSearchParams(location.search);
        const reference = params.get("reference");
        if (!reference) {
          toast.error("No payment reference found.");
          setLoading(false);
          return;
        }

        // 3️⃣ Verify payment
        const result = await verifyFundWalletTransaction(reference);
        if (result && result.success) {
          toast.success("Payment verified!");
          const category = result.data.data.metadata.payment_category;

          if (category === "membership") setModalType("membership");
          else if (category === "task") setModalType("task");
          else if (category === "advert") setModalType("advert");
          else if (category === "deposit") setModalType("wallet");

          setShowModal(true);
        } else {
          toast.error(result?.message || "Payment verification failed.");
        }
      } catch (err) {
        toast.error("An error occurred while processing payment.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, dispatch]);

  if (loading) return <div className="p-8 text-center">Processing payment...</div>;

  return (
    <>
      {showModal && modalType === "membership" && (
        <MembershipSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
      {showModal && modalType === "task" && (
        <TaskSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
      {showModal && modalType === "advert" && (
        <AdvertSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
      {showModal && modalType === "wallet" && (
        <WalletFundedSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
