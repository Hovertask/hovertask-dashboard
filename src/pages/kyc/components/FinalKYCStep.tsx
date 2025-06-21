import { CheckCheck } from "lucide-react";
import { Link } from "react-router";
import cn from "../../../utils/cn";
import { useEffect } from "react";

export default function FinalKycStep({
	setFormStep,
	formStep,
}: {
	setFormStep: React.Dispatch<React.SetStateAction<number>>;
	formStep: number;
}) {
	useEffect(() => {
		formStep;

		const docFrontImgSrc = (
			document.getElementById("doc-front-side") as HTMLImageElement
		).src as string;
		const docBackImgSrc = (
			document.getElementById("doc-back-side") as HTMLImageElement
		).src as string;
		const selfieImgSrc = (document.getElementById("selfie") as HTMLImageElement)
			?.src as string;
		const docFrontPreview = document.getElementById(
			"doc-front-side-preview",
		) as HTMLImageElement;
		const docBackPreview = document.getElementById(
			"doc-back-side-preview",
		) as HTMLImageElement;
		const selfiePreview = document.getElementById(
			"selfie-preview",
		) as HTMLImageElement;

		const nameInput = document.getElementById("name") as HTMLInputElement;
		const dobInput = document.getElementById("dob") as HTMLInputElement;
		const nidInput = document.getElementById("nid") as HTMLInputElement;
		const nidExpiryInput = document.getElementById(
			"nid-expiry",
		) as HTMLInputElement;
		const nameElement = document.getElementById("name-preview") as HTMLElement;
		const nidElement = document.getElementById("dob-preview") as HTMLElement;
		const dobElement = document.getElementById("nid-preview") as HTMLElement;
		const expiryElement = document.getElementById(
			"nid-expiry-preview",
		) as HTMLElement;

		if (nameInput && nameElement) nameElement.textContent = nameInput.value;
		if (dobInput && dobElement) dobElement.textContent = dobInput.value;
		if (nidInput && nidElement) nidElement.textContent = nidInput.value;
		if (nidExpiryInput && expiryElement)
			expiryElement.textContent = nidExpiryInput.value;
		if (docFrontPreview) docFrontPreview.src = docFrontImgSrc;
		if (docBackPreview) docBackPreview.src = docBackImgSrc;
		if (selfiePreview) selfiePreview.src = selfieImgSrc;
	}, [formStep]);

	return (
		<div className={cn("space-y-6", { hidden: formStep !== 3 })}>
			<h2 className="text-center text-xl font-medium">Review & Submit</h2>

			<div className="space-y-2">
				<div className="flex justify-center gap-4 max-w-lg mx-auto">
					<div className="relative aspect-square rounded-md bg-zinc-200/40 border border-dashed flex-1">
						<div className="absolute text-center p-4 inset-0 space-y-2 flex flex-col items-center justify-center">
							<CheckCheck className="h-8 w-8 mx-auto text-success" />
							<p>Front side of your document</p>
							<p className="text-xs">
								Upload the front side of your document. We support JPG, PNG, and
								PDF
							</p>
						</div>
						<img
							src=""
							alt=""
							id="doc-front-side-preview"
							className="max-h-full max-w-full mx-auto"
						/>
					</div>
					<div className="relative aspect-square rounded-md bg-zinc-200/40 border border-dashed flex-1">
						<div className="absolute text-center p-4 inset-0 space-y-2 flex flex-col items-center justify-center">
							<CheckCheck className="h-8 w-8 mx-auto text-success" />
							<p>Back side of your document</p>
							<p className="text-xs">
								Upload the front side of your document. We support JPG, PNG, and
								PDF
							</p>
						</div>
						<img
							src=""
							alt=""
							id="doc-back-side-preview"
							className="max-h-full max-w-full mx-auto"
						/>
					</div>
				</div>

				<button
					onClick={() => setFormStep(1)}
					type="button"
					className="text-primary text-sm block mx-auto hover:underline"
				>
					Reupload Images
				</button>
			</div>

			<div className="text-sm space-y-2 p-4 max-w-sm rounded-2xl shadow-md bg-white mx-auto">
				<div className="flex items-center gap-4">
					<img
						src=""
						id="selfie-preview"
						alt=""
						className="aspect-square rounded-xl max-w-56"
					/>
					<button
						onClick={() => setFormStep(2)}
						type="button"
						className="text-primary text-sm hover:underline text-left"
					>
						Reupload selfie image
					</button>
				</div>

				<div>
					<p>
						Fullname: <span className="font-medium" id="name-preview" />
					</p>
					<p>
						National ID Number:{" "}
						<span className="font-medium" id="nid-preview" />
					</p>
					<p>
						Date of Birth: <span className="font-medium" id="dob-preview" />
					</p>
					<p>
						License Expiry Date:{" "}
						<span className="font-medium" id="nid-expiry-preview" />
					</p>
				</div>
			</div>

			<p className="text-center text-sm">
				Once submitted, your details cannot be changed until the verification
				process is complete
			</p>

			<button
				className="px-4 py-1.5 w-full bg-primary text-white text-sm max-w-lg mx-auto block rounded-full"
				type="submit"
			>
				Submit for Verification
			</button>

			<p className="text-center text-sm">
				<Link to="/support" className="text-primary underline">
					Need help? Contact Support
				</Link>
			</p>
		</div>
	);
}
