import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../shared/components/Input";
import {
	ChevronDown,
	Church,
	Globe,
	Hash,
	LinkIcon,
	Speaker,
	User,
} from "lucide-react";
import CustomSelect from "../../../shared/components/Select";
import {
	genders,
	religions,
	socialMedia,
	states,
} from "../../../utils/selectAndAutocompletOptions";
import ImageInput from "../../../shared/components/ImageInput";
import AdvertSummaryModal from "./AdvertSummaryModal";
import { toast } from "sonner";
import InsufficientFundsModal from "./InsufficientFundsModal";
import cn from "../../../utils/cn";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../utils/getAuthorization";
import AdvertUploadSuccessModal from "./AdvertUploadSuccessModal";
import Loading from "../../../shared/components/Loading";
import {
	descriptionValidation,
	urlValidation,
} from "../../../utils/inputValidationPatterns";

/** Form for posting new adverts. */
export default function AdvertRequestForm() {
	const successModalProps = useDisclosure();
	const modalProps = useDisclosure();
	const isEngagementTask =
		new URLSearchParams(window.location.search).get("type") === "engagement";

	const {
		register,
		getValues,
		trigger,
		clearErrors,
		formState: { errors, isValid, isSubmitting },
		handleSubmit,
	} = useForm();

	useEffect(() => {
		if (isValid) clearErrors();
	}, [isValid, clearErrors]);

	async function submitAdvert() {
		try {
			const form = document.getElementById("advert-form") as HTMLFormElement;
			const response = await fetch(`${apiEndpointBaseURL}/advertise/create`, {
				method: "POST",
				body: new FormData(form),
				headers: { authorization: getAuthorization() },
			});

			if (!response.ok)
				return toast.error(
					"We couldn't complete your request at the moment due. Please try again soon.",
				);

			toast.success("Your advert has been placed successfully");
			successModalProps.onOpen();
		} catch {
			toast.error(
				"We couldn't complete your request at the moment due. Please try again soon.",
			);
		}
	}

	return (
		<>
			<form
				id="advert-form"
				onSubmit={handleSubmit(submitAdvert)}
				className="p-6 space-y-6"
			>
				<Input
					className="rounded-full bg-white"
					label={
						<Label
							title="Title of advert"
							description="Enter the title of your advert that will displayed to others."
						/>
					}
					icon={<Speaker size={16} />}
					placeholder="Enter the title of your advert"
					{...register("title", {
						required: "Enter the title of your advert",
						pattern: {
							value: /\w+(?:\s*.+)*/,
							message: "Enter a valid title.",
						},
					})}
					errorMessage={errors.title?.message as string}
				/>

				<CustomSelect
					options={socialMedia}
					label={
						<Label
							title="Select Platform"
							description="Choose the platform where you'd like to share or promote your content."
						/>
					}
					placeholder="Select platform"
					className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
					startContent={<Globe />}
					{...register("platforms", { required: "Select platform" })}
					errorMessage={errors.platforms?.message as string}
				/>

				<Input
					className="max-w-[250px] rounded-full bg-white"
					label={
						<Label
							title="Select Number of WhatsApp Status to Post"
							description="Enter the number of WhatsApp status advert posts you'd like to request."
						/>
					}
					icon={<Hash size={16} />}
					placeholder="0"
					{...register("no_of_status_post", {
						required: "Enter the number of posts you want",
						pattern: {
							value: /^\d+$/,
							message: "Enter a number. No spacing required.",
						},
					})}
					errorMessage={errors.no_of_status_post?.message as string}
				/>

				<CustomSelect
					options={genders}
					label={
						<Label
							title="Select Gender"
							description="Choose the target gender for your audience to ensure your advert reaches the most relevant individuals."
						/>
					}
					placeholder="Select gender"
					className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
					radius="full"
					startContent={<User />}
					{...register("gender", { required: "Select preferred gender." })}
					errorMessage={errors.gender?.message as string}
				/>

				<CustomSelect
					options={states}
					label={
						<Label
							title="Select Location"
							description="Choose the preferred location for your advert or service audience."
						/>
					}
					className="[&_button]:rounded-full [&_button]:bg-white"
					selectionMode="multiple"
					{...register("location", { required: "Select a location." })}
					errorMessage={errors.location?.message as string}
				/>

				<CustomSelect
					options={religions}
					label={
						<Label
							title="Select Religion"
							description="Choose the target religion for your audience or service."
						/>
					}
					className="[&_button]:rounded-full [&_button]:bg-white"
					selectionMode="multiple"
					placeholder="Select religion"
					startContent={<Church />}
					{...register("religion", { required: "Select preferred religion." })}
					errorMessage={errors.religion?.message as string}
				/>

				{isEngagementTask && (
					<Input
						className="rounded-full bg-white"
						label={
							<Label
								title="Your Social Media Post Link"
								description="Provide the link to your social media post to ensure accurate
									tracking and verification."
							/>
						}
						icon={<LinkIcon size={16} />}
						placeholder="Enter your post link"
						type="url"
						{...register("url", {
							required: "Enter the number of posts you want",
							pattern: urlValidation,
						})}
						errorMessage={errors.url?.message as string}
					/>
				)}

				<div className="space-y-1 text-sm">
					<Label
						title="Enter Advert Text or Caption"
						description="
							Write the text or caption for your advert to grab your audience's
							attention."
					/>
					<textarea
						{...register("description", {
							required: "Enter task description.",
							pattern: descriptionValidation,
							min: { value: 20, message: "Description is too short." },
						})}
						id="description"
						className="bg-white border border-zinc-300 rounded-2xl w-full h-40 focus:outline-primary p-4"
					/>
					{errors.description && (
						<small className="text-danger">
							{errors.description.message as string}
						</small>
					)}
				</div>

				<div>
					<Label
						title="Choose Your Advert Media Upload Option"
						description="Selecting the right media for your advert is essential to
							capturing attention and driving engagement. Below are the options
							available for uploading your media:"
					/>

					<div className="flex gap-6 items-center">
						<div className="flex flex-col gap-2">
							<label
								className="text-sm px-2 py-1 rounded-lg bg-primary/10 border border-primary text-primary transition-transform active:scale-95"
								htmlFor="images"
							>
								Upload video advert
							</label>
							<label
								className="text-sm px-2 py-1 rounded-lg bg-primary/10 border border-primary text-primary transition-transform active:scale-95"
								htmlFor="images"
							>
								Upload image advert
							</label>
						</div>
						<div className="max-w-[250px]">
							<ImageInput id="images" maxLength={3} required />
						</div>
					</div>
				</div>

				<SetPaymentMethod
					onAdvertPreviewOpen={modalProps.onOpen}
					isFormValid={isValid}
					triggerValidationFn={trigger}
				/>

				{isValid && (
					<AdvertSummaryModal
						modalProps={modalProps}
						getFormValue={getValues}
					/>
				)}

				<AdvertUploadSuccessModal {...successModalProps} />
			</form>

			{isSubmitting && <Loading fixed />}
		</>
	);
}

function Label({ title, description }: { title: string; description: string }) {
	return (
		<div>
			<p className="font-medium">{title}</p>
			<p className="text-xs">{description}</p>
		</div>
	);
}

function SetPaymentMethod(props: {
	onAdvertPreviewOpen: () => any;
	isFormValid: boolean;
	triggerValidationFn: () => any;
}) {
	const modalProps = useDisclosure();
	const [selectedMethod, setSelectedMethod] = useState("");

	return (
		<div className="pb-12">
			<div className="flex bg-white p-4 rounded-2xl justify-between items-center">
				<PaymentMethodDropdown {...{ setSelectedMethod, selectedMethod }} />

				<div className="flex gap-6 items-center">
					<span className="font-medium">₦1,000</span>
					<button
						type="button"
						onClick={() => {
							if (selectedMethod === "wallet") modalProps.onOpen();
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

function PaymentMethodDropdown({
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
				<div className="fixed inset-0" onClick={() => setIsOpen(false)} />
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
