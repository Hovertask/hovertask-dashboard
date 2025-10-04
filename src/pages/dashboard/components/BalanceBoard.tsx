import { Wallet } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function BalanceBoard({ balance }: { balance?: number }) {
	const [showWithdraw, setShowWithdraw] = useState(false);
	const [amount, setAmount] = useState<string>("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setShowWithdraw(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	const handleOpenWithdraw = (e: React.MouseEvent) => {
		e.preventDefault(); // keep the Link in place but stop navigation
		setShowWithdraw(true);
	};

	const handleContinue = async () => {
	if (!amount || Number(amount) <= 0) {
		return alert("Enter a valid amount");
	}

	if (Number(amount) < 5000) {
		return alert("Minimum withdrawal is ₦5,000");
	}

	setLoading(true);
	try {
		const res = await fetch(`https://backend.hovertask.com//api/withdraw`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount: Number(amount),
				account_number: "0000111111", // Replace with user's actual account number from profile
				bank_code: "044", // Replace with bank code (example: 044 = Access Bank)
				name: "Test User", // Replace with logged-in user's real name
			}),
		});

		const data = await res.json();
		if (data.status) {
			alert("Withdrawal initiated successfully!");
			setShowWithdraw(false);
			setAmount("");
		} else {
			alert("Failed: " + (data.message || "Something went wrong"));
		}
	} catch (error) {
		console.error(error);
		alert("Error connecting to server");
	} finally {
		setLoading(false);
	}
};


	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-[18.66px]">Total Balance</span>
			</div>

			<div className="flex items-center gap-12 flex-wrap">
				<div className="text-[34.67px] font-medium">
					₦{balance?.toFixed(2).toLocaleString()}
				</div>
				<div className="flex gap-6 text-sm flex-wrap font-medium">
					<Link
						to="/fund-wallet"
						className="flex items-center gap-2 px-[18.5px] py-[14px] text-white bg-primary rounded-full hover:bg-primary/80 transition-colors"
					>
						<Wallet size={16} /> Fund
					</Link>
					<Link
						to="/withdraw"
						onClick={handleOpenWithdraw}
						className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-full transition-colors hover:bg-primary/10"
					>
						<Wallet size={16} /> Withdraw
					</Link>
				</div>
			</div>

			<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-[#DAE2FF] p-8 rounded-2xl">
				<div className="space-y-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-[13.87px]">Earned</span>
					</div>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Pending</p>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Spent</p>
					<p className="text-[20.8px] font-medium">
						₦ {balance?.toFixed(2).toLocaleString()}
					</p>
				</div>
			</div>

			{/* Withdraw modal - appears when Withdraw Link is clicked. */}
			{showWithdraw && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* backdrop */}
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowWithdraw(false)}
					/>

					{/* modal card */}
					<div className="relative w-full max-w-3xl rounded-2xl p-6 md:p-8 bg-white shadow-2xl">
						<button
							className="absolute right-4 top-4 text-xl leading-none rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100"
							onClick={() => setShowWithdraw(false)}
						>
							&times;
						</button>

						<h3 className="text-[18px] font-medium mb-4">
							Easily transfer your wallet balance to your bank account
						</h3>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
								<span className="font-medium">2. Bank Details</span>
								<Link to="#" className="ml-auto text-indigo-600 hover:underline" onClick={(e)=>e.preventDefault()}>
									Change
								</Link>
							</div>

							{/* card with bank summary */}
							<div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
								<div className="flex items-center gap-3">
									<span className="inline-block w-9 h-9">
										<svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" className="w-9 h-6">
											<circle cx="12" cy="12" r="7" fill="#EB001B" />
											<circle cx="24" cy="12" r="7" fill="#F79E1B" />
										</svg>
									</span>
								</div>
								<div>
									<div className="font-medium">MasterCard/Visa/Verve Card</div>
									<div className="text-sm text-gray-600">FCMB | Alayande Nurudeen | 6576 3467 **** 0902</div>
								</div>
							</div>

							{/* blue rounded input area */}
							<div className="mt-4 bg-gradient-to-b from-[#EEF2FF] to-[#DCE6FF] p-6 rounded-2xl">
								<p className="text-gray-600 mb-4">Please input the amount you wish to withdraw from your wallet.</p>

								<div className="flex items-center gap-4">
									<div className="flex items-center bg-white rounded-full px-5 py-3 w-full border border-gray-300">
										<span className="mr-3 text-lg">₦</span>
										<input
											type="number"
											className="w-full outline-none text-[18px] placeholder-gray-400"
											placeholder="Amount"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
										/>
									</div>

									<button
										onClick={handleContinue}
										disabled={loading}
										className="px-6 py-3 rounded-full bg-blue-600 text-white min-w-[120px] disabled:opacity-50"
									>
										{loading ? "Processing..." : "Continue"}
									</button>
								</div>

								<p className="mt-3 text-sm text-gray-400">Please note that a transfer charge will be deducted from your account.</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
