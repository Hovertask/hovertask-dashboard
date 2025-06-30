import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import SellerInfoAside from "../../shared/components/SellerInfoAside";
import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../types";
import { useState } from "react";
import cn from "../../utils/cn";
import KYCForm from "./components/KYCForm";
import FaceVerificationForm from "./components/FaceVerificationForm";
import FinalKycStep from "./components/FinalKYCStep";

export default function KycVerificationForm() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);
	const [formStep, setFormStep] = useState(3);

	return (
		<div className="mobile:flex gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-12 mobile:w-[724px] max-w-[724px] overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<h1 className="text-xl font-medium">KYC Verification</h1>
				</div>

				<div>
					<div className="flex items-center gap-1 text-sm max-w-xl mx-auto">
						<div className="relative text-center">
							<span className="h-6 w-6 rounded-full bg-primary text-white inline-flex items-center justify-center">
								1
							</span>
							<span className="text-primary absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap">
								Step 1
							</span>
						</div>
						<span
							className={cn("flex-1 h-[2px] bg-zinc-600", {
								"bg-primary": formStep > 1,
							})}
						/>
						<div className="relative text-center">
							<span
								className={cn(
									"h-6 w-6 rounded-full bg-zinc-600 text-white inline-flex items-center justify-center",
									{
										"bg-primary": formStep > 2,
									},
								)}
							>
								2
							</span>
							<span
								className={cn(
									"text-zinc-600 absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap",
									{
										"text-primary": formStep > 2,
									},
								)}
							>
								Step 2
							</span>
						</div>
						<span
							className={cn("flex-1 h-[2px] bg-zinc-600", {
								"bg-primary": formStep === 3,
							})}
						/>
						<div className="relative text-center">
							<span
								className={cn(
									"h-6 w-6 rounded-full bg-zinc-600 text-white inline-flex items-center justify-center",
									{
										"bg-primary": formStep === 3,
									},
								)}
							>
								3
							</span>
							<span
								className={cn(
									"text-zinc-600 absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap",
									{
										"text-primary": formStep === 3,
									},
								)}
							>
								Step 3
							</span>
						</div>
					</div>
				</div>

				<form className="space-y-6">
					<KYCForm {...{ formStep, setFormStep }} />
					<FaceVerificationForm {...{ formStep, setFormStep }} />
					<FinalKycStep {...{ formStep, setFormStep }} />
				</form>
			</div>

			<SellerInfoAside {...{ ...authUser, hideChatBtn: true }} />
		</div>
	);
}
