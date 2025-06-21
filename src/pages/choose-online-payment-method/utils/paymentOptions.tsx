import { CreditCard } from "lucide-react";

function InternetBankTransferIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Bank Icon</title>
			<path
				d="M13.3337 5.33337C8.30566 5.33337 5.79099 5.33337 4.22966 6.89604C2.66833 8.45871 2.66699 10.972 2.66699 16C2.66699 21.028 2.66699 23.5427 4.22966 25.104C5.79233 26.6654 8.30566 26.6667 13.3337 26.6667H15.3337M18.667 5.33337C23.695 5.33337 26.2097 5.33337 27.771 6.89604C29.1897 8.31337 29.3203 10.5147 29.3337 14.6667"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M20.6667 18.6667V26.6667M20.6667 26.6667L23.3333 24.0001M20.6667 26.6667L18 24.0001M26.6667 26.6667V18.6667M26.6667 18.6667L29.3333 21.3334M26.6667 18.6667L24 21.3334"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13.3337 21.3334H8.00033M2.66699 13.3334H9.33366M29.3337 13.3334H14.667"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</svg>
	);
}

const paymentOptions = [
	{
		title: "MasterCard / Visa / Verver Card",
		description: "Pay instantly with your credit or debit card",
		icon: <CreditCard size={32} />,
		buttonText: "Pay with Card",
	},
	{
		title: "Bank Transfer (USSD)",
		description: "Transfer funds using your bank's USSD code",
		icon: <span className="text-3xl font-medium">₦</span>,
		buttonText: "Pay via USSD",
	},
	{
		title: "Internet Banking Transfer",
		description:
			"Make a transfer using your bank's mobile or internet banking app",
		icon: <InternetBankTransferIcon />,
		buttonText: "Make Transfer",
	},
];

export default paymentOptions;
