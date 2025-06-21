import { toast } from "sonner";

export default function sendVerificationEmail(email: string) {
	toast.promise(
		() =>
			new Promise((resolve, reject) => {
				fetch("https://hovertask.onrender.com/api/email/resend", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					},
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to send verification email");
						}
						resolve(undefined);
						return response.json();
					})
					.catch((error) => {
						console.error("Error sending verification email:", error);
						reject("Error sending verification email");
					});
			}),
		{
			loading: "Sending verification email...",
			error: (e) => e,
			success: `We've sent an email to ${email}!\nPlease check your inbox, and click the link to verify.`,
		},
	);
}
