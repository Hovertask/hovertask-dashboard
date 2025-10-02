import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { ArrowLeft, Hexagon, History, Megaphone } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import type { AuthUserDTO } from "../../../../types";
import AdvertCard from "../components/AdvertCard";
import FeatureCard from "../components/FeatureCard";
import InsufficientFundsModal from "../components/InsufficientFundsModal";
import advertFeatures from "../utils/advertFeatures";
import advertTypes from "../utils/advertTypes";
import getAuthorization from "../../../utils/getAuthorization";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";
import { setAuthUser } from "../../../redux/slices/auth";
import AdvertiseIntroModal from "./AdvertiseIntroModal";

export default function AdvertisePage() {
  const modalProps = useDisclosure(); // Insufficient funds
  const advertFeeModal = useDisclosure(); // ₦500 setup fee modal
  const nextStepModal = useDisclosure(); // <-- NEW: show next-step modal after payment
  const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
    (state) => state.auth.value
  );
  const dispatch = useDispatch();

  // ✅ Handler when user clicks "Continue"
  const handleContinue = () => {
    if (!authUser.has_paid_advert_fee) {
      advertFeeModal.onOpen();
    } else if (authUser.balance < 500) {
      modalProps.onOpen();
    } else {
      // Proceed to advert creation form
      console.log("Redirect to advert form");
    }
  };

  // ✅ Pay setup fee function
  const handlePaySetupFee = async () => {
    if (authUser.balance < 500) {
      advertFeeModal.onClose();
      modalProps.onOpen();
      return;
    }

    try {
      const res = await fetch(`${apiEndpointBaseURL}/advertise/pay-setup-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthorization(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Payment failed");
      }

      // ✅ Update Redux state with new balance + has_paid_advert_fee
      dispatch(setAuthUser({ ...authUser, ...data }));

      toast.success("₦500 setup fee paid successfully!");
      advertFeeModal.onClose();

      // 🚀 OPEN the Next Step modal so user knows what to do next
      nextStepModal.onOpen();
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
      <div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
        <Hero />

        {/* Features */}
        <div className="space-y-6">
          <p className="text-sm text-center">
            Advertise your products and services to thousands of active users on
            our website and mobile app every day. Here’s why placing your adverts
            on Hovertask Market Place is the best decision for your business:
          </p>

          <div className="grid grid-cols-2 gap-4 gap-y-8">
            {advertFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        {/* Advert Duration Section */}
        <div className="space-y-6">
          <div className="w-fit mx-auto flex items-center gap-2 py-2 px-4 rounded-full border-b border-zinc-400 -rotate-6">
            <History size={18} /> Advert Duration
          </div>

          <p className="bg-primary text-white p-4 rounded-2xl text-sm text-center">
            Your advert will stay visible on our platform for 1 month. After this
            period, you'll need to renew by placing another advert to maintain
            visibility.
          </p>

          <p className="text-sm text-center font-medium">
            Take advantage of Hovertask today and sell faster than ever!
          </p>

          {/* Setup Fee Trigger Button (only if not paid) */}
          {!authUser.has_paid_advert_fee && (
            <div className="flex items-center gap-4 justify-between py-2 px-6 border border-zinc-400 rounded-full max-w-sm mx-auto">
              <span className="text-xl font-medium">₦500</span>
              <button
                type="button"
                onClick={handleContinue}
                className="px-4 py-2 rounded-2xl text-sm text-white bg-primary active:scale-95 transition-transform"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Insufficient Funds Modal */}
        <InsufficientFundsModal {...modalProps} />

        {/* One-time Advert Fee Modal */}
        <Modal {...advertFeeModal} size="md">
          <ModalContent>
            <ModalHeader className="font-medium text-lg">
              One-time Advert Setup Fee
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">
                To begin creating advert tasks on Hovertask, you need to pay a
                one-time fee of <span className="font-bold">₦500</span>. <br />
                <br />
                This fee helps us verify advertisers, reduce spam, and cover
                administrative costs while keeping the platform reliable.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <span className="text-xl font-medium">₦500</span>
              <button
                type="button"
                onClick={handlePaySetupFee}
                className="px-4 py-2 rounded-2xl text-sm text-white bg-primary active:scale-95 transition-transform"
              >
                Continue
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Next Step Modal (shown immediately after successful payment) */}
        
		{/* Next Step Modal (shown immediately after successful payment) */}
<Modal {...nextStepModal} size="md">
  <ModalContent>
    <ModalHeader className="font-medium text-lg">
      Next Step: Choose Your Advert Type
    </ModalHeader>
    <ModalBody>
      <p className="text-sm leading-relaxed">
        🎉 Your one-time advert setup fee has been paid successfully.
        <br /><br />
        To get started, please choose the type of advert you'd like to
        run on Hovertask:
        <br /><br />
        • <span className="font-semibold">Advert</span> — ideal for directly
        promoting a product or service to potential buyers.
        <br />
        • <span className="font-semibold">Engagement</span> — perfect for
        boosting interactions (likes, shares, comments) to increase
        reach and awareness.
        <br /><br />
        Scroll the page below and select the advert type that best fits
        your goal. Once selected, you can proceed to create your advert task
        and start reaching thousands of users.
      </p>

      {/* ✅ Balance Display */}
      <div className="mt-4 bg-zinc-100 border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 text-center">
        💰 Your current balance:{" "}
        <span className="font-semibold text-primary">
          ₦{authUser.balance.toLocaleString()}
        </span>
      </div>
    </ModalBody>
    <ModalFooter className="flex justify-end">
      <button
        type="button"
        onClick={() => nextStepModal.onClose()}
        className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-primary active:scale-95 transition-transform"
      >
        Got it
      </button>
    </ModalFooter>
  </ModalContent>
</Modal>


        {/* Advert Types (only if fee is paid) */}
        {authUser.has_paid_advert_fee && (
          <div className="space-y-6">
            <div className="max-w-sm mx-auto flex items-center gap-4 p-4 rounded-3xl border-b border-primary overflow-x-auto">
              <button
                type="button"
                className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all bg-primary text-white"
              >
                <Hexagon className="h-4 w-4" /> Advert Tasks
              </button>
              <Link
                to="/advertise/engagement-tasks"
                className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all text-primary"
              >
                <Megaphone className="h-4 w-4" /> Engagement Tasks
              </Link>
            </div>

            <p className="text-sm text-center">
              Pay users to perform specific actions that increase the reach and
              visibility of your content. From likes to shares, get the engagement
              you need to grow your brand.
            </p>

            <div className="space-y-4">
              {advertTypes.map((ad) => (
                <AdvertCard key={ad.platform} {...ad} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-gradient-to-r from-white via-primary/30 to-white p-4 rounded-2xl">
      <div className="flex gap-6 max-mobile:gap-4">
        <Link to="/">
          <ArrowLeft />
        </Link>

        <div className="text-center">
          <h1 className="font-medium text-xl text-primary">
            Advertise anything Faster on Hovertask Marketplace
          </h1>
          <p className="text-sm">
            Promote your products and services to thousands of daily users on our
            platform and reach a wider audience across social media. Boost your
            sales and grow your business today!
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <img
          src="/images/7_Places_To_Shop_Online_On_A_Budget-removebg-preview 2.png"
          width={250}
          alt=""
        />
      </div>

      <AdvertiseIntroModal />
    </div>
  );
}
