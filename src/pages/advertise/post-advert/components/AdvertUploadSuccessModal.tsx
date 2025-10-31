import {
	Modal,
	ModalBody,
	ModalContent,
	type useDisclosure,
} from "@heroui/react";
import { Link } from "react-router";
import { toast } from "sonner";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../utils/getAuthorization";
import { useState } from "react";

interface AdvertUploadSuccessModalProps
	extends ReturnType<typeof useDisclosure> {
	pendingAdvert?: { id: number; user_id: number; type: string } | null;
}

export default function AdvertUploadSuccessModal({
	pendingAdvert,
	...props
}: AdvertUploadSuccessModalProps) {
	const [loading, setLoading] = useState(false);

	const initiatePayment = async () => {
		if (!pendingAdvert) return;
		setLoading(true);
		try {
			const response = await fetch(
				`${apiEndpointBaseURL}/wallet/initialize-payment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: getAuthorization(),
					},
					body: JSON.stringify({
						user_id: pendingAdvert.user_id,
						advert_id: pendingAdvert.id,
						type: pendingAdvert.type,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || "Failed to initiate payment.");
				setLoading(false);
				return;
			}

			toast.success("Redirecting to payment...");
			if (data?.payment_url) {
				window.location.href = data.payment_url;
			}
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal {...props} isDismissable={false} size="lg">
			<ModalContent>
				<ModalBody>
					<img
						src="/images/animated-checkmark.gif"
						width={150}
						alt=""
						className="block mx-auto"
					/>
					<div className="text-center">
						<h3 className="text-lg font-medium">Task Submitted</h3>
						<p className="text-sm">
							{pendingAdvert
								? "Your advert has been created but payment is pending. Complete your payment to activate it."
								: "Thank you for your payment! Your advert will be live within 10 minutes once approved by admin."}
						</p>
					</div>

					<div className="flex justify-center items-center gap-4 pb-4">
						{pendingAdvert ? (
							<button
								onClick={initiatePayment}
								className="text-sm p-2 rounded-2xl bg-primary text-white"
								disabled={loading}
							>
								{loading ? "Processing..." : "Pay Now"}
							</button>
						) : (
							<Link
								to="/advertise/tasks-history"
								className="text-sm p-2 rounded-2xl bg-primary text-white"
								type="button"
							>
								View Tasks History
							</Link>
						)}

						<button
							onClick={props.onClose}
							className="border border-primary text-primary rounded-2xl text-sm p-2"
							type="button"
						>
							Create Another Task
						</button>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
