import { ArrowLeft, Image, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { AuthUserDTO, Product } from "../../../types";
import { DragEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import cn from "../../utils/cn";
import {
	Modal,
	ModalBody,
	ModalContent,
	Select,
	SelectItem,
	useDisclosure,
} from "@heroui/react";
import productCategories from "../../utils/productCategories";
import { useForm } from "react-hook-form";
import ProductCard from "../../shared/components/ProductCard";
import Loading from "../../shared/components/Loading";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";

export default function ListProductPage() {
	document.title = "List New Product - Hovertask Dashboard";

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] min-h-full">
			<div className="bg-white shadow p-4 space-y-8">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">List a New Product</h1>
						<p className="text-sm text-zinc-500">
							Add a new product or service to the marketplace. Include details,
							set your price, and upload images to attract buyers
						</p>
					</div>
				</div>

				<hr className="border-dashed" />

				<SellerInformation />

				<hr />

				<ListingForm />
			</div>

			<div></div>
		</div>
	);
}

function SellerInformation() {
	const authUser = useSelector<any, AuthUserDTO>(
		(state: any) => state.auth.value,
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<img
					src={authUser.avatar || "/images/default-user.png"}
					width={50}
					height={50}
					className="rounded-full bg-zinc-200"
					alt=""
				/>

				<div>
					<p className="capitalize font-medium">
						{authUser.fname} {authUser.lname}
					</p>
					<p className="text-xs">@{authUser.username}</p>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center gap-2 text-sm">
					<img src="/images/nigerian-flag.png" width={20} alt="" /> |{" "}
					<span className="relative">
						<span className="absolute h-1 w-1 rounded-full bg-success -left-0.5 top-0.5"></span>{" "}
						Online
					</span>
				</div>

				<div className="px-2 py-1 rounded-full bg-success/10 text-success text-xs w-fit">
					Verified ID
				</div>
			</div>
		</div>
	);
}

function ListingForm() {
	const userId = useSelector<any, string>((state: any) => state.auth.value.id);
	const [draggedOver, setDraggedOver] = useState(false);
	const [imagesLength, setImagesLength] = useState<number>(0);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const [previewImageUrl, setPreviewImageUrl] = useState("");
	const modalProps = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({ mode: "all" });
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (imagesLength) {
			URL.revokeObjectURL(previewImageUrl);
			setPreviewImageUrl(
				URL.createObjectURL(imageInputRef.current?.files?.item(0)!),
			);
		}
	}, [imagesLength, draggedOver]);

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setDraggedOver(true);
	}

	function handleDragOut(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setDraggedOver(false);
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();

		try {
			const files = e.dataTransfer?.files;
			function verifyMimetype(file: File) {
				return /image\/.*/.test(file.type);
			}

			if (files && files.length) {
				const fileArr = Array.from(files);

				if (!fileArr.every(verifyMimetype))
					return toast.warning("Only images are allowed.");
				if (files.length > 5)
					return toast.error("Only a maximum of 5 images is allowed");
				if (imageInputRef.current)
					(imageInputRef.current.files = files), setImagesLength(files.length);
			}
		} finally {
			setDraggedOver(false);
		}
	}

	async function submitForm() {
		setIsSubmitting(true);
		const form = new FormData(formRef.current!);

		form.append("user_id", userId);
		form.append("currency", "NGN");
		form.append("stock", "100");
		form.append("meet_up_preference", "");

		const response = await fetch(
			apiEndpointBaseURL + "/products/create-product",
			{
				method: "post",
				headers: {
					authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
				body: form,
			},
		);

		if (!response.ok) throw new Error();

		toast.success("Product listed successfully!");
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit(modalProps.onOpen)}
			className="space-y-6"
		>
			<h3 className="text-sm text-center font-medium">Images/Media Upload</h3>

			<div className="flex max-sm:flex-col max-sm:gap-6 sm:items-end">
				<div className="flex-1 flex flex-col gap-2">
					<div className="text-sm">
						<h4>Add Images/Photos</h4>
						<p className="text-zinc-700 text-xs">
							Add visuals for better engagement
						</p>
					</div>
					<div>
						<h4>Video Upload</h4>
						<p className="text-zinc-700 text-xs">
							Showcase your product with a 30-seconds video
						</p>
					</div>
				</div>

				<div className="flex-1 space-y-3">
					<p className="text-xs text-center">
						Photos {imagesLength}/5 - You can add up to 5 photos.
					</p>
					<div
						onClick={() => imageInputRef.current?.click()}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDragLeave={handleDragOut}
						className={cn(
							"aspect-video bg-zinc-200 rounded-lg relative border border-zinc-400/80 text-sm",
							{
								"border-dashed border-4": draggedOver,
							},
						)}
					>
						<input
							ref={imageInputRef}
							onChange={(e) => {
								if (e.target.files && e.target.files.length > 5) {
									e.target.files = null;
									return toast.error("Only a maximum of 5 images is allowed");
								}

								if (!e.target.files || !e.target.files?.length)
									return toast.warning("Please select an image");

								setImagesLength(e.target.files?.length!);
								setPreviewImageUrl((prev) => {
									URL.revokeObjectURL(prev);
									return URL.createObjectURL(e.target.files?.item(0)!);
								});
							}}
							type="file"
							accept="image/*"
							multiple
							className="opacity-0"
							name="file_path"
							required
						/>

						<div
							className={cn(
								"absolute inset-0 flex items-center justify-center flex-col gap-2 text-center",
								{
									"bg-white/50": !!imagesLength,
								},
							)}
						>
							{draggedOver ? (
								<p>Drop it like it's hot</p>
							) : (
								<>
									<Image />
									Drag, Drop and Upload Your Photo
								</>
							)}
						</div>

						<img
							src={previewImageUrl}
							className="max-h-full max-w-full block mx-auto"
							alt=""
						/>
					</div>
				</div>
			</div>

			<hr className="border-dashed" />

			<GradientHeader>Product/Service Details</GradientHeader>

			<div className="text-sm space-y-12">
				<div className="space-y-2">
					<label htmlFor="name">Product/Service Name</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<Tag size={18} className="-scale-x-[1]" />
						<input
							type="text"
							placeholder="Product/Service Name"
							className="outline-none placeholder:text-xs flex-1"
							{...register("name", {
								required: "Enter product name",
								pattern: {
									value: /^[a-zA-Z0-9\s\-_,.()]{2,100}$/,
									message: "Enter a valid product name",
								},
							})}
						/>
					</div>
					{errors["name"] && (
						<small className="text-danger">
							{errors["name"].message as string}
						</small>
					)}
				</div>

				<div>
					<Select
						label="Category"
						labelPlacement="outside"
						variant="bordered"
						className="[&_button]:border-1 [&_button]:border-zinc-400 [&_button]:rounded-full"
						placeholder="Select a category"
						{...register("category_id", {
							required: "Select product category",
						})}
					>
						{productCategories.map((category, i) => (
							<SelectItem key={i + 1}>{category.label}</SelectItem>
						))}
					</Select>
					{errors["category"] && (
						<small className="text-danger">
							{errors["category"].message as string}
						</small>
					)}
				</div>

				<div className="-translate-y-6 space-y-2">
					<label htmlFor="description">
						<p>Product/Service Description</p>
						<p className="font-light text-zinc-600">
							Write the text or caption for your product or service to grab your
							customer's attention.
						</p>
					</label>
					<textarea
						{...register("description", {
							required: "Enter product description",
							pattern: {
								value:
									/^[a-zA-Z0-9\s\-_,.():;'"!?@%&*/\\[\]{}|+=<>~`$#^]{10,1000}$/,
								message: "Remove invalid characters from description",
							},
						})}
						name="description"
						id="description"
						className="outline-none border border-zinc-400 rounded-2xl w-full min-h-44 text-sm p-4"
					></textarea>
					{errors["description"] && (
						<small className="text-danger">
							{errors["description"].message as string}
						</small>
					)}
				</div>
			</div>

			<GradientHeader>Product/Service Pricing</GradientHeader>

			<div className="text-sm space-y-6">
				<div className="space-y-2">
					<label htmlFor="price">Price</label>
					<p className="flex items-center gap-2">
						<img src="/images/nigerian-flag.png" width={20} alt="" /> NGN{" "}
						<span style={{ fontSize: 18 }} className="material-icons-outlined">
							arrow_drop_down
						</span>
					</p>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<span className="font-medium text-base">₦</span>
						<input
							{...register("price", {
								required: "Enter product price",
								min: {
									value: 1,
									message: "Price must be greater than 0",
								},
								pattern: {
									value: /^\d+$/,
									message: "Enter valid price",
								},
							})}
							type="number"
							min={1}
							placeholder=""
							name="price"
							className="outline-none placeholder:text-xs flex-1"
						/>
					</div>
					{errors["price"] && (
						<small className="text-danger">
							{errors["price"].message as string}
						</small>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="price">Discount</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							{...register("discount", {
								max: {
									value: 100,
									message: "Discount cannot be greater than 100%",
								},
								pattern: {
									value: /^\d+$/,
									message: "Enter valid price",
								},
							})}
							type="number"
							defaultValue={0}
							placeholder=""
							className="outline-none placeholder:text-xs flex-1"
						/>
					</div>
					{errors["discount"] && (
						<small className="text-danger">
							{errors["discount"].message as string}
						</small>
					)}
				</div>

				<div className="pt-2">
					<Select
						label="Payment method"
						labelPlacement="outside"
						variant="bordered"
						placeholder="Select payment method"
						className="[&_button]:border-1 [&_button]:border-zinc-400 [&_button]:rounded-full"
						{...register("payment_method", {
							required: "Select payment method",
						})}
					>
						<SelectItem key="paystack">Paystack</SelectItem>
					</Select>
					{errors["payment_method"] && (
						<small className="text-danger">
							{errors["payment_method"].message as string}
						</small>
					)}
				</div>
			</div>

			<div className="text-sm space-y-4">
				<div>
					<h4 className="font-medium">Meetup Preference</h4>
					<p>Buyers will be able to see your preferences on your listing.</p>
				</div>

				<label className="flex items-center gap-4" htmlFor="physical-shipping">
					<input
						type="radio"
						name="shipping_available"
						id="physical-shipping"
					/>
					<div>
						<p className="font-medium">Shipping/Delivery Available</p>
						<p>Deliver physical products with ease</p>
					</div>
				</label>
				<label className="flex items-center gap-4" htmlFor="digital-shipping">
					<input type="radio" name="shipping_available" id="digital-shipping" />
					<div>
						<p className="font-medium">
							Digital Delivery/ Online Services Only
						</p>
						<p>Seamless delivery for online products or services</p>
					</div>
				</label>
			</div>

			<div className="text-sm space-y-4">
				<div className="space-y-2">
					<label htmlFor="delivery_fee">Delivery Cost (Optional)</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							type="number"
							defaultValue={0}
							placeholder=""
							className="outline-none placeholder:text-xs flex-1"
							{...register("delivery_fee", {
								pattern: {
									value: /^\d+$/,
									message: "Enter valid amount",
								},
							})}
						/>
					</div>
					{errors["delivery_fee"] && (
						<small className="text-danger">
							{errors["delivery_fee"].message as string}
						</small>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="estimated_delivery_date">
						Estimated Delivery Time
					</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							type="text"
							placeholder="E.g. 1 hour, 2 days, 2 week, 6 months, 1 year"
							className="outline-none placeholder:text-xs flex-1"
							{...register("estimated_delivery_date", {
								required: "Enter estimated delivery time",
								pattern: {
									value: /^\d+\s+(hour|day|month|year|week)s?$/i,
									message:
										"Enter valid delivery time. E.g. 1 day, 2 weeks, 2 months e.t.c.",
								},
							})}
						/>
					</div>
					{errors["estimated_delivery_date"] && (
						<small className="text-danger">
							{errors["estimated_delivery_date"].message as string}
						</small>
					)}
				</div>
			</div>

			<GradientHeader>Contact Information (Optional)</GradientHeader>

			<div className="text-sm space-y-4">
				<div className="space-y-2">
					<label htmlFor="phone_number">Phone Number</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							{...register("phone_number", {
								pattern: {
									value:
										/^\+?\d{1,4}?[-.\s]?(\(?\d{1,4}\)?)[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
									message: "Enter valid phone number",
								},
							})}
							type="tel"
							name="phone_number"
							className="outline-none placeholder:text-xs flex-1"
						/>
					</div>
					{errors["phone_number"] && (
						<small className="text-danger">
							{errors["phone_number"].message as string}
						</small>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="email">Email</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							{...register("phone_number", {
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Enter valid email address",
								},
							})}
							type="email"
							name="email"
							className="outline-none placeholder:text-xs flex-1"
						/>
					</div>
					{errors["email"] && (
						<small className="text-danger">
							{errors["email"].message as string}
						</small>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="social_media_link">Social Media Link</label>
					<div className="flex gap-2 border p-2 rounded-full border-zinc-400">
						<img src="/images/streamline_discount-percent-coupon.png" alt="" />
						<input
							type="url"
							{...register("social_media_link", {
								pattern: {
									value:
										/^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
									message: "Enter valid social media link",
								},
							})}
							name="social_media_link"
							className="outline-none placeholder:text-xs flex-1"
						/>
					</div>
					{errors["social_media_link"] && (
						<small className="text-danger">
							{errors["social_media_link"].message as string}
						</small>
					)}
				</div>
			</div>

			<div className="space-x-4">
				<button
					className="px-4 py-1.5 text-sm rounded-full transition-all active:scale-95 bg-primary text-white"
					type="submit"
				>
					Continue
				</button>
				<button
					className="px-4 py-1.5 text-sm rounded-full transition-all active:scale-95 hover:bg-primary/20 border border-primary text-primary"
					type="button"
				>
					Cancel
				</button>
			</div>

			<ListingPreviewModal
				{...modalProps}
				getValues={getValues}
				previewImageUrl={previewImageUrl}
				submitForm={submitForm}
				setIsSubmitting={setIsSubmitting}
			/>

			{isSubmitting && <Loading fixed />}
		</form>
	);
}

function GradientHeader({ children }: { children: string }) {
	return (
		<h3 className="px-4 py-2 bg-gradient-to-b from-white to-primary/25 text-center text-sm font-medium">
			{children}
		</h3>
	);
}

function ListingPreviewModal(
	props: ReturnType<typeof useDisclosure> & {
		previewImageUrl: string;
		submitForm(): any;
		getValues(): any;
		setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
	},
) {
	const successModalProps = useDisclosure();

	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			onClose={props.onClose}
		>
			<ModalContent>
				{(onClose: () => any) => (
					<ModalBody className="flex flex-col gap-2 justify-center items-center text-center p-4">
						<p>
							As you create your listing, preview how it will appear to others
							on Marketplace.
						</p>
						<ProductCard
							{...{
								...(props.getValues() as Product),
								images: [props.previewImageUrl],
							}}
						/>
						<div className="space-x-4">
							<button
								onClick={async () => {
									onClose();

									try {
										await props.submitForm();
										successModalProps.onOpen();
									} catch {
										toast.error("Product listing failed. Please try again.");
									} finally {
										props.setIsSubmitting(false);
									}
								}}
								className="px-4 py-1.5 text-sm rounded-full transition-all active:scale-95 bg-primary text-white"
								type="button"
							>
								Confirm and Publish
							</button>
							<button
								onClick={onClose}
								className="px-4 py-1.5 text-sm rounded-full transition-all active:scale-95 hover:bg-primary/20 border border-primary text-primary"
								type="button"
							>
								Edit Details
							</button>
						</div>

						<ProductListingSuccessModal {...successModalProps} />
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}

function ProductListingSuccessModal(props: ReturnType<typeof useDisclosure>) {
	const { isOpen, onOpenChange, onClose } = props;

	return (
		<Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
			<ModalContent>
				{(_onClose: () => void) => (
					<ModalBody>
						<div className="flex flex-col gap-1 items-center justify-center">
							<img src="/images/animated-checkmark.gif" alt="" />
							<h3>Your Listing is Live!</h3>
							<p>
								Your product has been successfully added to the marketplace.
							</p>
							<div className="flex items-center justify-center gap-4">
								<Link className="bg-primary text-white p-2 rounded-lg" to="/">
									Go to Dashboard
								</Link>
								<button
									className="border-primary text-primary p-2 rounded-lg"
									onClick={_onClose}
								>
									Go to Dashboard
								</button>
							</div>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
