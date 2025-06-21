import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	type useDisclosure,
} from "@heroui/react";
import { CheckCircle, LockIcon, Wallet } from "lucide-react";
import { Link } from "react-router";

export default function PaymentMethodModal(
	props: ReturnType<typeof useDisclosure>,
) {
	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			onClose={props.onClose}
			size="xl"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex items-center gap-2 text-base font-normal">
							<CheckCircle stroke="#11182766" size={16} /> Payment Method
						</ModalHeader>
						<ModalBody className="space-y-3 mb-4">
							<p>Choose an online payment method</p>

							<div className="space-y-6">
								<Link
									to="/choose-online-payment-method"
									className="flex items-center gap-4 border-1 border-primary rounded-3xl p-6"
								>
									<div>
										<LockIcon size={32} className="text-primary" />
									</div>
									<div>
										<p className="font-medium">100% Secure Online Payment</p>
										<p className="text-xs text-[#00000099]">
											Pay securely using you MasterCard/Visa/Verve card. Bank
											Transfer via USSD or Internet Bank Transfer
										</p>
									</div>
								</Link>

								<Link
									to="#"
									className="flex items-center gap-4 border-1 border-primary rounded-3xl p-6"
								>
									<div>
										<Wallet size={32} className="text-primary" />
									</div>
									<div>
										<p className="font-medium">Pay With Wallet</p>
										<p className="text-xs text-[#00000099]">
											Pay with wallet balance.
										</p>
									</div>
								</Link>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
