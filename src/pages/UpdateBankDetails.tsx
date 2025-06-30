import { ArrowLeft, CheckCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import CustomSelect from "../shared/components/Select";
import banks from "../utils/banks";
import Input from "../shared/components/Input";
import { useForm } from "react-hook-form";
import Loading from "../shared/components/Loading";
import { useSelector } from "react-redux";
import { AuthUserDTO } from "../../types";
import cn from "../utils/cn";
import UserProfileCard from "../shared/components/UserProfileCard";

export default function UpdateBankDetailsPage() {
	const authUser = useSelector<any, AuthUserDTO>((state) => state.auth.value);
	const [bankDetails, setBankDetails] = useState({
		bankName: "",
		accountNumber: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: "onBlur" });

	function submit() {
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setIsEditing(false);
		}, 4000);
	}

	useEffect(() => {
		if (!bankDetails.bankName.trim() || !bankDetails.accountNumber.trim())
			setIsEditing(true);
	}, [bankDetails]);

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div
				className={cn(
					"px-4 py-8 space-y-2 overflow-hidden min-h-full flex flex-col",
					{
						"block space-y-6":
							!isEditing &&
							bankDetails.bankName.trim() &&
							bankDetails.accountNumber.trim(),
					},
				)}
			>
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Update Bank Details</h1>
						<p className="text-sm text-zinc-500">Add your bank details</p>
					</div>
				</div>

				{(isEditing ||
					!bankDetails.bankName.trim() ||
					!bankDetails.accountNumber.trim()) && (
					<div className="bg-white shadow-md rounded-2xl flex-1 min-h-full p-4">
						<form
							onSubmit={handleSubmit(submit)}
							className="p-4 rounded-2xl shadow-md space-y-4"
						>
							<CustomSelect
								options={banks}
								label="Bank Name"
								placeholder="Select bank"
								labelPlacement="outside"
								{...register("bank_name", {
									required: "Select bank name",
								})}
								errorMessage={errors.bank_name?.message as string}
								isAutoComplete
								inputValue={
									banks.find((bank) => bank.key === bankDetails.bankName)
										?.label!
								}
								selectedKey={bankDetails.bankName}
								onSelectionChange={(id) =>
									setBankDetails((prev) => ({
										...prev,
										bankName: (id as string) || "",
									}))
								}
							/>
							<Input
								label="Account Number"
								placeholder="Enter account number"
								{...register("account_number", {
									required: "Select bank name",
									pattern: {
										value: /^\d{10}$/,
										message:
											"Please enter a valid account number with the right number of digits",
									},
								})}
								errorMessage={errors.account_number?.message as string}
								value={bankDetails.accountNumber}
								onChange={(e) =>
									setBankDetails((prev) => ({
										...prev,
										accountNumber: e.target.value,
									}))
								}
							/>
							<button className="bg-primary p-2 rounded-xl text-white transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transition-none">
								Save Bank Details
							</button>
						</form>
					</div>
				)}

				{!isEditing &&
					bankDetails.bankName.trim() &&
					bankDetails.accountNumber.trim() && (
						<div className="p-4 rounded-2xl flex justify-between gap-4 items-center shadow-md bg-white">
							<div className="space-y-3">
								<h2 className="font-medium flex items-center gap-2">
									<CheckCircle size={16} className="text-success" /> Bank
									Details
								</h2>

								<div className="flex items-center gap-2">
									<img src="/images/logos_mastercard.png" alt="" />
									<div>
										<p>MasterCard/Visa/Verve</p>
										<p className="font-light flex gap-x-2 flex-wrap">
											<span>
												{
													banks.find(
														(bank) => bank.key === bankDetails.bankName,
													)?.label!
												}
											</span>{" "}
											<span>|</span>{" "}
											<span>
												{authUser.fname} {authUser.lname}
											</span>{" "}
											<span>|</span>{" "}
											<span>
												{bankDetails.accountNumber
													.split("")
													.map((num, i) => (i > 2 && i < 7 ? "*" : num))
													.join("")}
											</span>
										</p>
									</div>
								</div>
							</div>

							<button
								onClick={() => setIsEditing(true)}
								className="text-primary hover:bg-primary/20 transition-all p-2 rounded-full flex items-center gap-2 text-sm"
							>
								Change <ChevronRight size={14} />
							</button>
						</div>
					)}
				{isSubmitting && <Loading fixed />}
			</div>

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}
