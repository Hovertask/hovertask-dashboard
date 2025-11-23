import { toast } from "sonner";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../utils/getAuthorization";
import type { useDisclosure } from "@heroui/react";
import type { UseFormSetError } from "react-hook-form";

// Track in-progress submissions by form id to avoid duplicate submissions
const inProgressSubmissions = new Set<string>();

type ProgressState = "start" | "pending" | "done" | "error";

export default async function submitAdvert(
  successModalProps: ReturnType<typeof useDisclosure>,
  setError: UseFormSetError<any>,
  setPendingAdvert?: React.Dispatch<
    React.SetStateAction<{ id: number; user_id: number; type: string } | null>
  >,
  onProgress?: (state: ProgressState) => void
) {
  const formId = "advert-form";

  // Prevent duplicate submissions for the same form
  if (inProgressSubmissions.has(formId)) {
    toast.warning("Submission already in progress");
    onProgress?.("start");
    return;
  }

  inProgressSubmissions.add(formId);
  onProgress?.("start");

  try {
    const form = document.getElementById(formId) as HTMLFormElement;

    const response = await fetch(`${apiEndpointBaseURL}/advertise/create`, {
      method: "POST",
      body: new FormData(form),
      headers: { authorization: getAuthorization() },
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (responseData.error) {
        Object.keys(responseData.error).forEach((field) => {
          setError(field as any, {
            type: "server",
            message: responseData.error[field][0],
          });
        });
        toast.error("Please correct the errors in the form.");
        onProgress?.("error");
        return;
      }

      toast.error(
        "We couldn't complete your request at the moment. Please try again soon."
      );
      onProgress?.("error");
      return;
    }

    // ✅ Handle both "advert" or "task" response types
    const advert = responseData.data?.advert;
    const task = responseData.data?.task;
    const item = task || advert; // whichever exists

    if (item?.status === "pending") {
      toast.warning("Advert created but payment is pending.");
      onProgress?.("pending");

      // Pass advert info up so modal can display payment button
      if (setPendingAdvert) {
        setPendingAdvert({
          id: item.id,
          user_id: item.user_id,
          type: task ? "task" : "advert",
        });
      }
    } else {
      toast.success("Your advert has been placed successfully");
      onProgress?.("done");
    }

    successModalProps.onOpen();
    form.reset();
  } catch (err) {
    console.error(err);
    toast.error(
      "We couldn't complete your request at the moment. Please try again soon."
    );
    onProgress?.("error");
  } finally {
    inProgressSubmissions.delete(formId);
  }
}
