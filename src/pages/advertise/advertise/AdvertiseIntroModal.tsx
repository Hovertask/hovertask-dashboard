import {
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { Link } from "react-router"; // 👈 import Link for navigation

export default function AdvertiseIntroModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); 
 

  // 👇 Open modal immediately when the page loads
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(close) => ( // 👈 renamed _onClose → close for clarity
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

            {/* Option Buttons */}
            <div className="space-y-4">
              {/* ✅ Button 1: Link to product listing page */}
              <Link
                to="/marketplace/list-product?type=advertise" // ✅ navigate to product listing page
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
                onClick={close} // ✅ closes modal using HeroUI’s close function
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
