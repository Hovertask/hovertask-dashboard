import {
	Modal,
	ModalBody,
	ModalContent,
	type useDisclosure,
} from "@heroui/react";
import { Link } from "react-router";

export default function AdvertUploadSuccessModal(
	props: ReturnType<typeof useDisclosure>,
) {
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
							Thank you for your payment! Your advert will be live within the
							next 10 minutes once approved by admin. Track its performance in
							your dashboard.
						</p>
					</div>
					<div className="flex justify-center items-center gap-4 pb-4">
						<Link
							to="/advertise/tasks-history"
							className="text-sm p-2 rounded-2xl bg-primary text-white"
							type="button"
						>
							View Tasks History
						</Link>
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
