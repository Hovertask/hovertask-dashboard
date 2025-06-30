import { useDisclosure } from "@heroui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../../shared/components/Input";
import { Church, Globe, Hash, LinkIcon, Speaker, User } from "lucide-react";
import CustomSelect from "../../../../shared/components/Select";
import {
	genders,
	religions,
	socialMedia,
	states,
} from "../../../../utils/selectAndAutocompletOptions";
import ImageInput from "../../../../shared/components/ImageInput";
import AdvertSummaryModal from "./AdvertSummaryModal";
import AdvertUploadSuccessModal from "./AdvertUploadSuccessModal";
import Loading from "../../../../shared/components/Loading";
import {
	descriptionValidation,
	urlValidation,
} from "../../../../utils/inputValidationPatterns";
import Label from "./Label";
import SetPaymentMethod from "./SetPaymentMethod";

/** Form for posting new adverts. */
export default function AdvertRequestForm() {
	const formRef = useRef<HTMLFormElement>(null);
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
	} = useForm();

	useEffect(() => {
		if (isValid) clearErrors();
	}, [isValid, clearErrors]);

	return (
		<>
			<form id="advert-form" className="p-6 space-y-6" ref={formRef}>
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
						successModalProps={successModalProps}
					/>
				)}

				<AdvertUploadSuccessModal {...successModalProps} />
			</form>

			{isSubmitting && <Loading fixed />}
		</>
	);
}
