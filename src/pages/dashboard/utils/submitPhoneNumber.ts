import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../utils/getAuthorization";

export default function submitPhoneNumber(form: FieldValues) {
	fetch(apiEndpointBaseURL + "/addmeup/create", {
		method: "post",
		body: JSON.stringify(form),
		headers: {
			authorization: getAuthorization(),
			"content-type": "application/json",
		},
	})
		.then((response) => {
			if (response.ok) {
				toast.success("WhatsApp number added successfully!");
				window.location.assign("/add-me-up");
			} else
				throw new Error(
					"We could not process your request at this time. Please try again.",
				);
		})
		.catch((error) =>
			toast.error(
				error.message || "An unknown error occurred. Please try again.",
			),
		);
}
