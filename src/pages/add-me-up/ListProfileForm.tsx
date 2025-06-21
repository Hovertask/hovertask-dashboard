import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ImageInput from "../_shared/components/ImageInput";
import Input from "../_shared/components/Input";
import { useState } from "react";
import Loading from "../_shared/components/Loading";
import AddMeUpAside from "../_shared/components/AddMeUpAside";
import CustomSelect from "../_shared/components/Select";
import { useForm } from "react-hook-form";
import states from "../../utils/states";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import { toast } from "sonner";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import EmptyMapErr from "../_shared/components/EmptyMapErr";

export default function ListProfileForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: "onBlur" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const modalProps = useDisclosure();
	const listingTypes = [
		{ key: "earner", label: "Earn Money" },
		{ key: "advertiser", label: "Advertise Products" },
		{ key: "both", label: "Resell Products" },
	];
	const listingDurations = [
		{ key: "1_day", label: "24 Hours" },
		{ key: "3_days", label: "3 Days" },
		{ key: "7_days", label: "1 Week" },
		{ key: "14_days", label: "2 Weeks" },
		{ key: "30_days", label: "1 Month" },
		{ key: "90_days", label: "3 Months" },
		{ key: "180_days", label: "6 Months" },
	];
	const genders = [
		{ key: "male", label: "Male" },
		{ key: "female", label: "Female" },
		{ key: "both", label: "Any gender" },
	];

	function submit(e: React.FormEvent<HTMLFormElement>) {
		setIsSubmitting(true);

		const form = new FormData(e.target as HTMLFormElement);

		form.append("how_you_want_your_profile_listed", "public");
		fetch(`${apiEndpointBaseURL}/addmeup/listcontact`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${localStorage.getItem("auth_token") as string}`,
			},
			body: form,
		})
			.then((res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			})
			.then((data) => toast.success(data.message))
			.catch((e: any) =>
				toast.error(e.message || "An error occurred. Please try again."),
			)
			.finally(() => {
				setIsSubmitting(false);
				modalProps.onOpen();
			});
	}

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/add-me-up/list-profile">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">List Profile</h1>
						<p className="text-sm text-zinc-500">Manage Your Account</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit((_, e) =>
						submit(e as unknown as React.FormEvent<HTMLFormElement>),
					)}
					className="space-y-6"
				>
					<CustomSelect
						options={listingTypes}
						label="Listing Type"
						labelPlacement="outside"
						placeholder="Select listing type"
						{...register("listing_type", {
							required: "Listing type is required",
						})}
						errorMessage={errors.listing_type?.message as string}
					/>

					<Input
						type="text"
						label="Display Name"
						placeholder="Enter display name"
						{...register("display_name", {
							required: "Display name is required",
							minLength: {
								value: 3,
								message: "Display name must be at least 3 characters",
							},
							pattern: {
								value: /^[a-zA-Z0-9 ]+$/,
								message: "Display name must be alphanumeric",
							},
						})}
						errorMessage={errors.display_name?.message as string}
					/>

					<Input
						type="tel"
						label="WhatsApp Number"
						icon={
							<button
								type="button"
								className="flex items-center gap-1 hover:bg-zinc-200 py-1 px-2 rounded-lg transition-all active:scale-95"
							>
								<img src="/images/nigerian-flag.png" width={15} alt="" />
								<ChevronDown size={12} />
							</button>
						}
						id="whatsapp-number"
						placeholder="Enter your WhatsApp number"
						{...register("whatsapp_number", {
							required: "WhatsApp number is required",
							pattern: {
								value: /^[0-9]+$/,
								message: "WhatsApp number must be numeric",
							},
						})}
						errorMessage={errors.whatsapp_number?.message as string}
					/>

					<div className="pt-2">
						<CustomSelect
							options={listingDurations}
							label="How long do you want your profile listed"
							labelPlacement="outside"
							placeholder="Select how long you want"
							{...register("how_long_you_want_your_profile_listed", {
								required: "Duration is required",
							})}
							errorMessage={
								errors.how_long_you_want_your_profile_listed?.message as string
							}
						/>
					</div>

					<div className="pt-2">
						<CustomSelect
							options={genders}
							label="Which genders do you want"
							labelPlacement="outside"
							placeholder="Select gender"
							{...register("gender", { required: "Select a gender" })}
							errorMessage={errors.gender?.message as string}
						/>
					</div>

					<div className="pt-2">
						<CustomSelect
							options={states}
							label="Where do you want contacts from"
							labelPlacement="outside"
							placeholder="Select where you want contacts from"
							{...register("where_you_want_your_contacts_from", {
								required: "Select a location",
							})}
							errorMessage={
								errors.where_you_want_your_contacts_from?.message as string
							}
						/>
					</div>

					<div className="max-w-sm space-y-2">
						<label htmlFor="image" className="text-sm">
							Display Image
						</label>
						<ImageInput id="image" name="display_picture" required />
					</div>

					<button
						type="submit"
						className="px-4 py-3 rounded-2xl transition-all active:scale-95 bg-primary text-white"
					>
						List Profile
					</button>
				</form>

				{isSubmitting && <Loading fixed />}
			</div>

			<InsufficientPointsModal {...modalProps} />
			<AddMeUpAside />
		</div>
	);
}

function InsufficientPointsModal(props: ReturnType<typeof useDisclosure>) {
	const navigate = useNavigate();

	return (
		<Modal {...props} onClose={() => navigate("/add-me-up")}>
			<ModalContent>
				{(onClose) => (
					<ModalBody className="py-8">
						<EmptyMapErr
							description={
								<div className="space-y-2 mb-2">
									<h3 className="font-medium">Oops!</h3>
									<p className="text-xs font-light">
										Your current AddMeUp points is low
									</p>
									<p className="text-sm">
										Your profile will be listed on our explore for 6 hours, this
										will cost you 1,200 points
									</p>
								</div>
							}
							onButtonClick={onClose}
							buttonInnerText="Buy More Points"
						/>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
