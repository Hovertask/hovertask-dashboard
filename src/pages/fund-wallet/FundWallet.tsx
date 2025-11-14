import { ArrowLeft, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { AuthUserDTO } from "../../../types";
import handleFundWallet from "./utils/handleFundWallet";
import WithdrawModal from "../dashboard/components/WithdrawModal"; // import the modal

export default function FundWalletPage() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	const [amount, setAmount] = useState("");
	const [showWithdrawModal, setShowWithdrawModal] = useState(false); // state for modal

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm({ mode: "all" });

	return (
		<div className="mobile:grid grid-cols-[1fr_182px] gap-4 min-h-full">
			<div className="px-4 py-6 space-y-6 bg-white">
				{/* Header */}
				<div className="flex gap-4">
					<Link to="/" className="mt-1">
						<ArrowLeft />
					</Link>

					<div className="space-y-1">
						<h1 className="text-2xl">Fund Your Wallet</h1>
						<p className="text-xl font-light text-black/75">
							Easily add funds to your wallet to shop, pay, or resell
							effortlessly
						</p>
					</div>
				</div>

				{/* Wallet balance card */}
				<div className="bg-white shadow flex items-center justify-between gap-4 p-6 rounded-2xl max-w-[522px] w-fit">
					<span>Wallet Balance</span>
					<span className="font-medium text-[30.59px]">
						₦{authUser.balance.toLocaleString()}
					</span>
					<button
						type="button"
						onClick={() => setShowWithdrawModal(true)} // open modal on click
						className="border border-primary text-primary px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/20 transition-colors font-medium"
					>
						<Wallet size={16} /> Withdraw
					</button>
				</div>

				{/* Fund Wallet form */}
				<div className="p-4 rounded-3xl bg-primary/20 font-light space-y-3">
					<p>Please input the amount you wish to add to your wallet</p>

					<form
						className="flex items-center gap-2.5"
						onSubmit={handleSubmit(() =>
							handleFundWallet({
								email: authUser.email,
								amount: Number(amount),
								type: "deposit",
							}),
						)}
					>
						<div className="flex flex-1 gap-4 items-center bg-white py-2 px-4 rounded-full border border-[#989898] max-w-[399px]">
							<span className="text-xl font-medium text-zinc-500">₦</span>
							<input
								type="number"
								className="flex-1 outline-none"
								placeholder="Enter amount"
								required
								min={1000}
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary p-2 rounded-xl text-white font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transition-none"
						>
							Fund Wallet
						</button>
					</form>
				</div>
			</div>

			{/* Withdraw Modal */}
			<WithdrawModal
				show={showWithdrawModal}
				onClose={() => setShowWithdrawModal(false)}
				balance={authUser.balance} // pass the wallet balance
			/>
		</div>
	);
}
