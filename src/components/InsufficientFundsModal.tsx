import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { Link } from "react-router";

export default function InsufficientFundsModal(
	props: ReturnType<typeof useDisclosure>,
) {
	const { isOpen, onOpenChange } = props;
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{() => (
					<ModalBody className="flex flex-col justify-center items-center gap-3 text-center text-sm pb-4">
						<img
							src="/images/fluent-color_calendar-cancel-16.png"
							width={40}
							alt=""
						/>
						<h4 className="font-medium text-lg">Oops! Insufficient Funds</h4>
						<p>
							You do not have enough funds in your wallet to pay for this
							advert. Please fund your wallet and try again.
						</p>
						<Link
							to="/fund-wallet"
							className="px-4 py-2 rounded-xl text-sm text-white bg-primary active:scale-95 transition-transform"
						>
							Fund Wallet
						</Link>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
