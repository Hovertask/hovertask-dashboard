// src/features/advert/components/forms/AdvertSummaryModal.tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  type useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import submitAdvert from "../utils/submitAdvert";

export default function AdvertSummaryModal(props: {
  modalProps: ReturnType<typeof useDisclosure>;
  successModalProps: ReturnType<typeof useDisclosure>;
  getFormValue: () => FieldValues;
  setError: UseFormSetError<any>;
  setPendingAdvert: React.Dispatch<
    React.SetStateAction<{ id: number; user_id: number; type: string } | null>
  >;
}) {
  const {
    platform,
    title,
    location,
    no_of_status_post,
    number_of_participants,
    payment_per_task,
    estimated_cost,
    deadline,
  } = props.getFormValue();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function initAdvertSubmission() {
    // close summary modal immediately
    props.modalProps.onClose();

    try {
      await submitAdvert(
        props.successModalProps,
        props.setError,
        props.setPendingAdvert, // ✅ pass pending setter
        (state) => {
          if (state === "start" || state === "pending") setIsSubmitting(true);
          else setIsSubmitting(false);
        }
      );
    } finally {
      // reset loading state unless submitAdvert redirected the page
      setIsSubmitting(false);
    }
  }

  return (
    <Modal {...props.modalProps} size="lg">
      <ModalContent>
        <ModalBody>
          <div className="text-sm p-2 flex items-end justify-between gap-4">
            <ul className="space-y-1 flex-1">
              <li>
                <span className="font-medium">Platform: </span>
                <span className="capitalize">{platform}</span>
              </li>
              <li>
                <span className="font-medium">Advert title: </span>
                {title}
              </li>
              <li>
                <span className="font-medium">Posts needed: </span>
                {no_of_status_post}
              </li>
              <li>
                <span className="font-medium">Location: </span>
                <span className="capitalize">
                  {location?.replaceAll(",", ", ")}
                </span>
              </li>
              <li>
                <span className="font-medium">Number of Participants: </span>
                {number_of_participants}
              </li>
              <li>
                <span className="font-medium">Payment Per Task: </span>N{" "}
                {Number(payment_per_task).toLocaleString()}
              </li>
              <li>
                <span className="font-medium">Estimated Cost: </span>N{" "}
                {Number(estimated_cost).toLocaleString()}
              </li>
              <li>
                <span className="font-medium">Deadline: </span>
                {deadline}
              </li>
            </ul>

            <button
              type="button"
              onClick={initAdvertSubmission}
              disabled={isSubmitting}
              className={`bg-primary p-2 w-fit rounded-xl text-white flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:brightness-95"}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Activating...</span>
                </>
              ) : (
                <>Activate My Advert</>
              )}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}





















