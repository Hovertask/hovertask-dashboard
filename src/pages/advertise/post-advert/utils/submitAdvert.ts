import { toast } from "sonner";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../utils/getAuthorization";
import type { useDisclosure } from "@heroui/react";

export default async function submitAdvert(successModalProps: ReturnType<typeof useDisclosure>) {
  try {
    const form = document.getElementById("advert-form") as HTMLFormElement;
    const response = await fetch(`${apiEndpointBaseURL}/advertise/create`, {
      method: "POST",
      body: new FormData(form),
      headers: { authorization: getAuthorization() },
    });

    if (!response.ok)
      return toast.error(
        "We couldn't complete your request at the moment due. Please try again soon.",
      );

    toast.success("Your advert has been placed successfully");
    successModalProps.onOpen();
    form.reset();
  } catch {
    toast.error(
      "We couldn't complete your request at the moment due. Please try again soon.",
    );
  }
}