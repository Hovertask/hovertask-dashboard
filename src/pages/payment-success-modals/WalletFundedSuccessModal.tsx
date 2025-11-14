import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Link } from "react-router";

export default function WalletFundedSuccessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(closeHandler) => (
          <ModalBody>
            <div className="text-center space-y-4">
              <img
                src="/images/animated-checkmark.gif"
                alt="Success"
                className="mx-auto w-20"
              />
              <h3 className="text-xl font-semibold">Wallet Funded Successfully!</h3>
              <p>Your wallet has been credited and is ready to use.</p>
              <p>
                You can now post adverts, boost tasks, or perform activities that
                require wallet balance.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/fund-wallet"
                  onClick={closeHandler}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  View Wallet
                </Link>
                <Link
                  to="/"
                  onClick={closeHandler}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
