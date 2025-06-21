import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import AddWhatsAppNumberModal from "./AddWhatsAppNumberModal";

/** Prompts user to add their  WhatsApp number to gain contacts.  */
export default function ContactGainModal() {
	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
	const addWhatsAppModalProps = useDisclosure();

	useEffect(() => {
		onOpen(); // Auto open modal.
	}, []);

	return (
		<>
			<Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<ModalBody className="mb-4">
							<img
								width={150}
								src="/images/_WhatsApp_tiene_un_nuevo_diseño_y_así_lo_puedes_descargar_-removebg-preview 1.png"
								className="block mx-auto"
								alt=""
							/>
							<h3 className="font-medium text-lg text-center">
								Need More WhatsApp Contacts or Viewers? Got You
							</h3>
							<p className="text-sm text-zinc-700 text-center">
								Add new friends, rack up points and get your profile listed for
								others to add you back
							</p>
							<button
								onClick={() => (onClose(), addWhatsAppModalProps.onOpen())}
								className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
							>
								Continue
							</button>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

			{/* When the user clicks on the `Continue` button, this modal opens. */}
			<AddWhatsAppNumberModal {...addWhatsAppModalProps} />
		</>
	);
}
