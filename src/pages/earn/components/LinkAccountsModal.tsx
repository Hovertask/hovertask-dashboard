import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { Link } from "react-router";

export default function LinkAccountsModal() {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	useEffect(() => {
		onOpen();
	}, [onOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onClose={onClose}
			size="sm"
		>
			<ModalContent>
				{(onClose: () => unknown) => (
					<ModalBody className="space-y-1 pb-4">
						<img
							src="/images/iconoir_info-empty.png"
							alt=""
							className="block mx-auto"
							width={84}
						/>
						<h4 className="font-medium text-center">Oops</h4>
						<p className="text-xs font-light text-center">
							Link your social media accounts before performing tasks
						</p>
						<Link
							to="/earn/connect-accounts"
							onClick={onClose}
							className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
						>
							Connect Now
						</Link>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
