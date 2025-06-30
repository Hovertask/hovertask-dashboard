import { toast } from "sonner";
import getAuthorization from "../../../utils/getAuthorization";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";

export default function requestVerificationEmail(email: string) {
	toast.promise(
		() =>
			new Promise((resolve, reject) => {
				fetch(
					`${apiEndpointBaseURL.replace("/v1", "")}/email/resend`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: getAuthorization(),
						},
					},
				).then(resolve)
					.catch(() => reject("Failed to send verification email"));
			}),
		{
			loading: "Sending verification email...",
			error: (e) => e,
			success: `We've sent an email to ${email}!\nPlease check your inbox, and click the link to verify.`,
		},
	);
}
