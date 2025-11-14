import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Link } from "react-router";

export default function TaskSuccessModal({
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
              <h3 className="text-xl font-semibold">Task Submitted Successfully!</h3>
              <p>
                Your task submission has been received and is now pending review.
              </p>
              <p>
                Once approved, your earnings will be added to your wallet. You can
                continue earning by completing more tasks.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/advertise/engagement-tasks-history"
                  onClick={closeHandler}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    View Tasks History
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
