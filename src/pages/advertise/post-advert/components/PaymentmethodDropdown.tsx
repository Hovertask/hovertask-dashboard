import { ChevronDown } from "lucide-react";
import cn from "../../../../utils/cn";
import { useState } from "react";

export default function PaymentMethodDropdown({
	selectedMethod,
	setSelectedMethod,
}: {
	setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
	selectedMethod: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const paymentMethods = {
		wallet: "Pay With My Wallet",
		online: "Use Online Payment",
	};

	return (
		<div className="relative text-sm">
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0"
					onClick={() => setIsOpen(false)}
					onKeyDown={() => setIsOpen(false)}
				/>
			)}
			<input
				type="hidden"
				value={selectedMethod}
				name="payment_method"
				required
			/>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-1 transition-transform active:scale-95"
			>
				{selectedMethod
					? paymentMethods[selectedMethod as keyof typeof paymentMethods]
					: "Select Payment Method"}{" "}
				<ChevronDown
					className={cn("transition-transform", {
						"rotate-180": isOpen,
					})}
					size={12}
				/>
			</button>
			<div
				className={cn(
					"absolute bg-white flex flex-col whitespace-nowrap transition transform [transform-origin:top_center] p-2 rounded-lg shadow text-sm space-y-1 scale-0",
					{
						"scale-1": isOpen,
					},
				)}
			>
				<button
					type="button"
					className="hover:text-primary"
					onClick={() => {
						setIsOpen(false);
						setSelectedMethod("wallet");
					}}
				>
					Pay With My Wallet
				</button>
				<button
					type="button"
					className="hover:text-primary"
					onClick={() => {
						setIsOpen(false);
						setSelectedMethod("online");
					}}
				>
					Use Online Payment
				</button>
			</div>
		</div>
	);
}
