import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Link } from "react-router";

export default function AdvertSuccessModal({
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
              <h3 className="text-xl font-semibold">Advert Created Successfully!</h3>
              <p>
                Your advert has been submitted and is now pending admin approval.
              </p>
              <p>
                Once approved, it will become visible to earners who can start
                completing tasks on it.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/advertise/advert-tasks-history"
                  onClick={closeHandler}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  View My Adverts
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
