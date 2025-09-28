import { toast } from "sonner";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../utils/getAuthorization";
import type { useDisclosure } from "@heroui/react";
import type { UseFormSetError } from "react-hook-form";

export default async function submitAdvert(
  successModalProps: ReturnType<typeof useDisclosure>,
  setError: UseFormSetError<any>
) {
  try {
    const form = document.getElementById("advert-form") as HTMLFormElement;

    const response = await fetch(`${apiEndpointBaseURL}/advertise/create`, {
      method: "POST",
      body: new FormData(form),
      headers: { authorization: getAuthorization() },
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.error) {
        // Laravel validation errors → push into react-hook-form
        Object.keys(responseData.error).forEach((field) => {
          setError(field as any, {
            type: "server",
            message: responseData.error[field][0],
          });
        });
        return toast.error("Please correct the errors in the form.");
      }

      return toast.error(
        "We couldn't complete your request at the moment. Please try again soon."
      );
    }

    toast.success("Your advert has been placed successfully");
    successModalProps.onOpen();
    form.reset();
  } catch {
    toast.error(
      "We couldn't complete your request at the moment. Please try again soon."
    );
  }
}
