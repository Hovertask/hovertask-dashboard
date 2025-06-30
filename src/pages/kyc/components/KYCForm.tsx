import { useState } from "react";
import cn from "../../../utils/cn";
import { useForm } from "react-hook-form";
import CustomSelect from "../../../shared/components/Select";
import { BookUser } from "lucide-react";
import Input from "../../../shared/components/Input";
import { toast } from "sonner";
import { Link } from "react-router";

export default function KYCForm({
	setFormStep,
	formStep,
}: {
	setFormStep: React.Dispatch<React.SetStateAction<number>>;
	formStep: number;
}) {
	const [imagesUrl, setImages] = useState<[string, string]>(["", ""]);
	const {
		register,
		trigger,
		formState: { isValid, errors },
	} = useForm({ mode: "onBlur" });

	return (
		<div
			className={cn("space-y-6", {
				hidden: formStep !== 1, // Hide the form if it is not actively used
			})}
		>
			<div className="text-center">
				<h2 className="text-xl font-medium">Complete Your KYC</h2>
				<p className="text-primary text-sm">
					Provide your KYC to list products and build trust in the marketplace
				</p>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<CustomSelect
					{...register("country", { required: "Select your country" })}
					placeholder="Your Country"
					options={[{ key: "nigeria", label: "Nigeria" }]}
					errorMessage={errors.country?.message as string}
				/>
				<CustomSelect
					{...register("document_type", {
						required: "Select your document type",
					})}
					placeholder="Document Type"
					options={[
						{ key: "drivers_license", label: "Driver's License" },
						{ key: "passport", label: "Passport" },
						{ key: "national_id_card", label: "National ID Card" },
					]}
					errorMessage={errors.document_type?.message as string}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="relative aspect-video rounded-md bg-zinc-200/40 border border-dashed">
					<div className="absolute text-center p-4 inset-0 space-y-2">
						<BookUser className="h-8 w-8 mx-auto" />
						<p>Front side of your document</p>
						<p className="text-xs">
							Upload the front side of your document. We support JPG, PNG, and
							PDF
						</p>
						<label
							className="text-sm text-primary hover:underline cursor-pointer"
							htmlFor="input-1"
						>
							Choose a file
						</label>
						<input
							required
							onChange={(e) => {
								// Display the selected image or PDF file.
								const newUrl =
									// biome-ignore lint/complexity/useOptionalChain:
									e.target.files &&
									e.target.files[0] &&
									e.target.files[0].type.startsWith("image")
										? URL.createObjectURL(e.target.files[0])
										: // biome-ignore lint/complexity/useOptionalChain:
											e.target.files &&
												e.target.files[0] &&
												e.target.files[0].type.includes("pdf")
											? "/images/pdf-thumbnail.webp"
											: null;

								if (imagesUrl[0]) URL.revokeObjectURL(imagesUrl[0]);

								setImages([newUrl || "", imagesUrl[1]]);
							}}
							type="file"
							accept=".png,.jpg,.jpeg,.pdf"
							name="front_cover"
							id="input-1"
							className="invisible"
						/>
					</div>
					<img
						src={imagesUrl[0]}
						alt=""
						id="doc-front-side"
						className="max-h-full max-w-full mx-auto"
					/>
				</div>

				<div className="relative aspect-video rounded-md bg-zinc-200/40 border border-dashed">
					<div className="absolute text-center p-4 inset-0 space-y-2">
						<BookUser className="h-8 w-8 mx-auto" />
						<p>Back side of your document</p>
						<p className="text-xs">
							Upload the front side of your document. We support JPG, PNG, and
							PDF
						</p>
						<label
							className="text-sm text-primary hover:underline cursor-pointer"
							htmlFor="input-2"
						>
							Choose a file
						</label>
						<input
							required
							onChange={(e) => {
								// Display the selected image or PDF file.
								const newUrl =
									// biome-ignore lint/complexity/useOptionalChain:
									e.target.files &&
									e.target.files[0] &&
									e.target.files[0].type.startsWith("image")
										? URL.createObjectURL(e.target.files[0])
										: // biome-ignore lint/complexity/useOptionalChain:
											e.target.files &&
												e.target.files[0] &&
												e.target.files[0].type.includes("pdf")
											? "/images/pdf-thumbnail.webp"
											: null;

								if (imagesUrl[0]) URL.revokeObjectURL(imagesUrl[0]);

								setImages([imagesUrl[0], newUrl || ""]);
							}}
							type="file"
							name="back_cover"
							accept=".png,.jpg,.jpeg,.pdf"
							id="input-2"
							className="invisible"
						/>
					</div>
					<img
						src={imagesUrl[1]}
						alt=""
						id="doc-back-side"
						className="max-h-full max-w-full mx-auto"
					/>
				</div>
			</div>

			<div>
				<div className="flex items-center gap-4">
					<input
						type="checkbox"
						id="consent"
						{...register("consent", { required: "This field is required" })}
					/>
					<label htmlFor="consent" className="text-sm">
						I confirm that I uploaded valid government-issued phot ID. This ID
						include my picture, signature, date of birth, and address.
					</label>
				</div>
				<small className="text-danger">
					{errors.consent?.message as string}
				</small>
			</div>

			<hr className="border-dashed" />

			<div className="grid grid-cols-2 gap-6">
				<Input
					id="name"
					label="Full name"
					placeholder="Your fullname"
					{...register("name", { required: "Enter your full name" })}
					errorMessage={errors.name?.message as string}
				/>
				<Input
					id="dob"
					label="Date of birth"
					placeholder="Your date of birth"
					{...register("dob", { required: "Enter your date of birth" })}
					errorMessage={errors.dob?.message as string}
					type="date"
				/>
				<Input
					id="nid"
					label="National ID No."
					placeholder="DD/MM/YY"
					{...register("national_id_number", {
						required: "Enter your national ID number",
					})}
					errorMessage={errors.national_id_number?.message as string}
				/>
				<Input
					id="nid-expiry"
					label="Expiration Date"
					placeholder="DD/MM/YY"
					{...register("expiry_date", {
						required: "Enter your national ID expiry date",
					})}
					errorMessage={errors.expiry_date?.message as string}
					type="date"
				/>
			</div>

			<p className="text-center">OR</p>

			<div className="max-w-xl mx-auto border border-zinc-400 rounded-3xl p-6 flex gap-x-8">
				<img src="/images/qr-code.png" alt="" />
				<div className="flex flex-col justify-between max-w-40">
					<h3>Scan the QR Code</h3>
					<p className="text-xs">
						Open the camera app and scan the QR code on the screen.
					</p>
					<Link to="#" className="text-primary hover:underline text-xs">
						How to scan QR code
					</Link>
				</div>
			</div>

			<div className="flex gap-6">
				<button
					onClick={async () => {
						await trigger();
						if (!imagesUrl[0]) return toast.error("Select document front.");
						if (!imagesUrl[1]) return toast.error("Select document back.");
						if (isValid) setFormStep(2);
					}}
					className="py-1.5 px-6 rounded-xl text-sm bg-primary text-white"
					type="button"
				>
					Continue
				</button>
				<Link
					to="/kyc"
					className="py-1.5 px-6 rounded-xl text-sm border border-primary text-primary"
					type="button"
				>
					Cancel
				</Link>
			</div>
		</div>
	);
}
