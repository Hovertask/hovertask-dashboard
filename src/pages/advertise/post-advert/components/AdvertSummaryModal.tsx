// src/features/advert/components/forms/AdvertSummaryModal.tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  type useDisclosure,
} from "@heroui/react";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import submitAdvert from "../utils/submitAdvert";

export default function AdvertSummaryModal(props: {
  modalProps: ReturnType<typeof useDisclosure>;
  successModalProps: ReturnType<typeof useDisclosure>;
  getFormValue: () => FieldValues;
  setError: UseFormSetError<any>;
  setPendingAdvert: React.Dispatch<
    React.SetStateAction<{ id: number; user_id: number } | null>
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

  async function initAdvertSubmission() {
    props.modalProps.onClose();

    await submitAdvert(
      props.successModalProps,
      props.setError,
      props.setPendingAdvert // ✅ pass pending setter
    );
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
              className="bg-primary p-2 w-fit rounded-xl text-white"
            >
              Activate My Advert
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
