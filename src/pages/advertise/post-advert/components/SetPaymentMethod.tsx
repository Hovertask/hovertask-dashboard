import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import InsufficientFundsModal from "../../components/InsufficientFundsModal";
import { toast } from "sonner";
import type { AuthUserDTO } from "../../../../../types";
import { useSelector } from "react-redux";
import PaymentMethodDropdown from "./PaymentmethodDropdown";

export default function SetPaymentMethod(props: {
	onAdvertPreviewOpen: () => any;
	isFormValid: boolean;
	triggerValidationFn: () => any;
	estimatedCost: number; // 👈 new prop
}) {
	const modalProps = useDisclosure();
	const [selectedMethod, setSelectedMethod] = useState("");
	const user: AuthUserDTO = useSelector((state: any) => state.auth.value);

	return (
		<div className="pb-12">
			<div className="flex bg-white p-4 rounded-2xl justify-between items-center">
				<PaymentMethodDropdown {...{ setSelectedMethod, selectedMethod }} />

				<div className="flex gap-6 items-center">
					<span className="font-medium">₦{props.estimatedCost.toLocaleString()}</span>
					<button
						type="button"
						onClick={() => {
							if (selectedMethod === "wallet" && user.balance < props.estimatedCost)
								modalProps.onOpen();
							else if (props.isFormValid && selectedMethod)
								props.onAdvertPreviewOpen();
							else if (!selectedMethod && props.isFormValid)
								toast.info("Select payment method");
							else props.triggerValidationFn();
						}}
						className="p-2 rounded-2xl bg-primary text-white transition-transform active:scale-95"
					>
						Continue
					</button>
				</div>

				<InsufficientFundsModal {...modalProps} />
			</div>
		</div>
	);
}
