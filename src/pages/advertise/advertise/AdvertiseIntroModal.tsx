import {
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router"; // 👈 import Link for navigation
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../utils/getAuthorization";

export default function AdvertiseIntroModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); 
  const [userBalance, setUserBalance] = useState<number | null>(null);


  // 👇 Open modal immediately when the page loads
  useEffect(() => {
    onOpen();

    // Example: fetch balance from API (replace URL with your backend route)
   const fetchBalance = async () => {
  try {
    const res = await fetch(`${apiEndpointBaseURL}/wallet/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthorization(), // ✅ add auth header
      },
    });

    const data = await res.json();
    setUserBalance(data.balance); // 👈 backend should return { balance: 2500 }
  } catch (error) {
    console.error("Failed to fetch balance:", error);
  }
};


    fetchBalance();
  }, [onOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(close) => (
          <ModalBody className="text-center space-y-6 p-6">
            {/* Top Illustration */}
            <div className="flex justify-center">
              <img
                src="/images/Group 1000004512.png"
                alt="Advertise"
                className="max-w-[250px]"
              />
            </div>

            {/* Heading */}
            <h2 className="font-semibold text-lg">Advertise Your Way</h2>
            <p className="text-sm text-zinc-600">
              Promote your products, services, or content effortlessly.
            </p>

            {/* Description */}
            <p className="text-sm">
              Select the perfect advert package below to suit your business
              needs and start reaching thousands of potential buyers today!
            </p>

            {/* 🔔 Balance Reminder */}
            {userBalance !== null && (
              <div className="bg-zinc-100 border border-zinc-200 rounded-xl py-3 px-4 text-sm text-zinc-700">
                💰 You still have a balance of{" "}
                <span className="font-semibold text-primary">
                  ₦{userBalance.toLocaleString()}
                </span>.  
                Create a task now to start earning!
              </div>
            )}

            {/* Option Buttons */}
            <div className="space-y-4">
              {/* ✅ Button 1: Link to product listing page */}
              <Link
                to="/marketplace/list-product?type=resell"
                className="block w-full border border-primary text-primary rounded-2xl py-4 text-sm hover:bg-primary/5 transition"
              >
                Advertise on the Hovertask Market <br />
                <span className="text-xs text-zinc-500">
                  Showcase your products directly on our marketplace and reach
                  ready-to-buy audience.
                </span>
              </Link>

              {/* ✅ Button 2: Close modal */}
              <button
                onClick={close}
                className="w-full border border-primary text-primary rounded-2xl py-4 text-sm hover:bg-primary/5 transition"
              >
                Advertise on Social Media <br />
                <span className="text-xs text-zinc-500">
                  Leverage social media to promote your brand with targeted
                  campaigns.
                </span>
              </button>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
