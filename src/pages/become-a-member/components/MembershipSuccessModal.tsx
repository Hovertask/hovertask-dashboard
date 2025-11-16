import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Link } from "react-router";

export default function MembershipSuccessModal({
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
              <h3 className="text-xl font-semibold">
                Congratulations! You Are Now A Member!
              </h3>
              <p>
                Your membership has been successfully activated. Start earning
                daily by posting adverts and completing tasks on your social
                media accounts.
              </p>
              <p>
                Click the button below to generate your next task and begin
                earning. <br /> The more tasks you complete, the more you earn.
              </p>

              {/* Warning-style box */}
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 text-left rounded-md max-w-md mx-auto">
                <strong>Important:</strong> You need to create your first task
                to unlock and use other features on the site.
              </div>

              <div className="flex justify-center gap-4">
                <Link
                  to="/advertise/post-advert"
                  onClick={closeHandler}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Create Task
                </Link>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
