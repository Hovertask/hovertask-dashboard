import { ArrowLeft, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { AuthUserDTO } from "../../../types";
import handleFundWallet from "./utils/handleFundWallet";
import WithdrawModal from "../dashboard/components/WithdrawModal";

export default function FundWalletPage() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	const [amount, setAmount] = useState("");
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm({ mode: "all" });

	return (
		<div
			className="
				min-h-full 
				grid 
				grid-cols-1 
				gap-6 
				md:grid-cols-[1fr_220px] 
				md:gap-10 
				bg-gray-50 
				p-4
			"
		>
			{/* Left Column */}
			<div className="space-y-6 bg-white p-4 md:p-6 rounded-xl shadow-sm">

				{/* Header */}
				<div className="flex gap-4 items-start">
					<Link to="/" className="mt-1">
						<ArrowLeft className="w-6 h-6" />
					</Link>

					<div className="space-y-1">
						<h1 className="text-xl sm:text-2xl font-semibold">Fund Your Wallet</h1>
						<p className="text-sm sm:text-lg font-light text-black/75">
							Easily add funds to your wallet to shop, pay, or resell effortlessly
						</p>
					</div>
				</div>

				{/* Wallet Balance Card */}
				<div
					className="
						bg-white 
						shadow 
						flex 
						flex-col 
						sm:flex-row 
						items-start 
						sm:items-center 
						justify-between 
						gap-4 
						p-5 
						rounded-2xl
					"
				>
					<span className="text-base sm:text-lg font-medium">Wallet Balance</span>

					<span className="font-semibold text-3xl sm:text-[30px]">
						₦{authUser.balance.toLocaleString()}
					</span>

					<button
						type="button"
						onClick={() => setShowWithdrawModal(true)}
						className="
							border border-primary 
							text-primary 
							px-4 py-2.5 
							rounded-full 
							flex items-center gap-2 
							hover:bg-primary/20 
							transition-colors 
							font-medium 
							w-full 
							sm:w-auto
						"
					>
						<Wallet size={16} /> Withdraw
					</button>
				</div>

				{/* Fund Wallet Form */}
				<div className="p-4 rounded-3xl bg-primary/20 font-light space-y-3">
					<p className="text-sm sm:text-base">
						Please input the amount you wish to add to your wallet
					</p>

					<form
						className="flex flex-col sm:flex-row items-center gap-3"
						onSubmit={handleSubmit(() =>
							handleFundWallet({
								email: authUser.email,
								amount: Number(amount),
								type: "deposit",
							}),
						)}
					>
						{/* Input */}
						<div
							className="
								flex items-center 
								w-full 
								bg-white 
								py-2.5 px-4 
								rounded-full 
								border border-[#989898]
							"
						>
							<span className="text-lg font-medium text-zinc-500">₦</span>
							<input
								type="number"
								className="flex-1 outline-none ml-2 text-base"
								placeholder="Enter amount"
								required
								min={1000}
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="
								bg-primary 
								w-full sm:w-auto 
								px-6 py-3 
								rounded-xl 
								text-white 
								font-medium 
								transition-transform 
								active:scale-95 
								disabled:opacity-50 
								disabled:cursor-not-allowed
							"
						>
							Fund Wallet
						</button>
					</form>
				</div>
			</div>

			{/* Right Column (desktop only) */}
			<div className="hidden md:block">
				{/* Your extra sidebar or ads can go here */}
			</div>

			<WithdrawModal
				show={showWithdrawModal}
				onClose={() => setShowWithdrawModal(false)}
				balance={authUser.balance}
			/>
		</div>
	);
}
