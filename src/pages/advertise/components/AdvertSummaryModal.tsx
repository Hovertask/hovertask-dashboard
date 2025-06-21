import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import type { FieldValues } from "react-hook-form";

export default function AdvertSummaryModal(props: {
	modalProps: ReturnType<typeof useDisclosure>;
	getFormValue: () => FieldValues;
}) {
	const { platform, title, location, no_of_status_post } = props.getFormValue();

	function initAdvertSubmission() {
		const advertForm = document.getElementById(
			"advert-form",
		) as HTMLFormElement;

		props.modalProps.onClose();
		advertForm.submit();
	}

	return (
		<Modal {...props.modalProps} size="lg">
			<ModalContent>
				<ModalBody>
					<div className="text-sm p-2 flex items-end justify-between gap-4">
						<ul className="space-y-1 flex=1">
							<li>
								<span className="font-medium">Estimated Task Cost:</span> N
								{Number(no_of_status_post * 1000).toLocaleString()}
							</li>
							<li>
								<span className="font-medium">Platform: </span>
								<span className="capitalize">{platform}</span>
							</li>
							<li>
								<span className="font-medium">Advert title: </span>
								{title}
							</li>
							<li>
								<span className="font-medium">Status posts needed: </span>
								{no_of_status_post}
							</li>
							<li>
								<span className="font-medium">Location: </span>
								<span className="capitalize">
									{location?.replaceAll(",", ", ")}
								</span>
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
