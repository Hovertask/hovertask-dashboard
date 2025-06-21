import { toast } from "sonner";
import getAuthorization from "../../../utils/getAuthorization";

export default function requestVerificationEmail(email: string) {
	toast.promise(
		() =>
			new Promise(async (resolve, reject) => {
				try {
					const response = await fetch(
						"https://hovertask.onrender.com/api/email/resend",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: getAuthorization(),
							},
						},
					);
					if (!response.ok) reject("Failed to send verification email");
					else resolve(undefined);
				} catch {
					reject(
						"We could not complete your request at this time. Please try again.",
					);
				}
			}),
		{
			loading: "Sending verification email...",
			error: (e) => e,
			success: `We've sent an email to ${email}!\nPlease check your inbox, and click the link to verify.`,
		},
	);
}
