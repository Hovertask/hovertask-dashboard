import { ArrowLeft, Image, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
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
import { MessageSquare, PhoneCall } from "lucide-react";


export default function ListProductPage() {
	document.title = "List New Product - Hovertask Dashboard";

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const isResellType = params.get("type") === "resell";
	const isListProduct = params.get("type") === "list-product";

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] min-h-full">
			<div className="bg-white shadow p-4 space-y-8">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					{ isResellType && (
					<div className="space-y-2">
						<h1 className="text-xl font-medium">List a Product  for resell</h1>
						<p className="text-sm text-zinc-500">
							Add a new product or service for resell task to get more convertion
							
						</p>
					</div>
					)}
					{isListProduct && (
                    
					<div className="space-y-2">
						<h1 className="text-xl font-medium">List a New Product</h1>
					</div>
					)}
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
    (state: any) => state.auth.value
  );

 return (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-2xl shadow-sm border gap-4 md:gap-0">
    {/* Left: Profile + Info */}
    <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
      <img
        src={authUser.avatar || "/images/default-user.png"}
        width={48}
        height={48}
        className="rounded-full bg-zinc-200 flex-shrink-0"
        alt={authUser.fname}
      />

      <div className="flex-1 space-y-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {authUser.fname} {authUser.lname}
        </p>
        <p className="text-xs text-zinc-500 truncate">@{authUser.username}</p>

        {/* Online status */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 flex-wrap">
          <span className="flex items-center gap-1 truncate">
            <img src="/images/nigerian-flag.png" width={16} alt="flag" />
            <span className="flex items-center gap-1 truncate">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Online
            </span>
          </span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 text-xs mt-1 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium truncate">
            Verified ID
          </span>
          <span className="flex items-center gap-1 truncate">
            ⭐ <span className="font-medium">4.8</span>
          </span>
        </div>
      </div>
    </div>

    {/* Right: Action Buttons */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-full w-full sm:w-auto">
        <PhoneCall size={16} /> Contact Seller
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-400 text-blue-500 text-sm rounded-full w-full sm:w-auto">
        <MessageSquare size={16} /> Start Chat
      </button>
    </div>
  </div>
);
}

function ListingForm() {
	const userId = useSelector<any, string>((state: any) => state.auth.value.id);
	// compute query params locally so this component reacts to URL changes
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const isResellType = params.get("type") === "resell";
	const [draggedOver, setDraggedOver] = useState(false);
	const [images, setImages] = useState<{ file_path: string }[]>([]);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const modalProps = useDisclosure();
	const budgetInfoModal = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({ mode: "all" });
	const formRef = useRef<HTMLFormElement>(null);

	// ✅ cleanup object URLs when component unmounts or images change
	useEffect(() => {
		return () => {
			images.forEach((img) => URL.revokeObjectURL(img.file_path));
		};
	}, [images]);

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
			if (files && files.length) {
				const fileArr = Array.from(files);

				// validate
				if (!fileArr.every((f) => /image\/.*/.test(f.type)))
					return toast.warning("Only images are allowed.");
				if (fileArr.length > 5)
					return toast.error("Only a maximum of 5 images is allowed");

				// convert to object URLs
				const mapped = fileArr.map((file) => ({
					file_path: URL.createObjectURL(file),
				}));

				setImages(mapped);

				// keep files in input for submission
				if (imageInputRef.current) {
					const dt = new DataTransfer();
					fileArr.forEach((f) => dt.items.add(f));
					imageInputRef.current.files = dt.files;
				}
			}
		} finally {
			setDraggedOver(false);
		}
	}

	async function submitForm() {
		try {
			setIsSubmitting(true);

			const form = new FormData(formRef.current!);
			form.append("user_id", userId);
			form.append("currency", "NGN");
			form.append("stock", "100");
			form.append("meet_up_preference", "");

			const response = await fetch(
				apiEndpointBaseURL + "/products/create-product",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					},
					body: form,
				},
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to create product");
			}

			toast.success("✅ Product listed successfully!");
			modalProps.onClose();
		} catch (err: any) {
			toast.error(err.message || "Something went wrong, try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit(() => modalProps.onOpen())}
			className="space-y-6"
		>
			{/* image upload */}
			<div className="flex border border-dashed border-zinc-300 rounded-md p-3">
  {/* Left Section */}
  <div className="w-1/2 flex flex-col justify-center space-y-2 text-sm">
    <div>
      <p className="font-semibold">Add Images/Photos</p>
      <p className="text-zinc-500">Add Visuals for Better Engagement</p>
    </div>
    <div>
      <p className="font-semibold">Video Upload</p>
      <p className="text-zinc-500">Showcase your product with a 30-second video.</p>
    </div>
  </div>

  {/* Right Section */}
  <div className="w-1/2 flex flex-col items-center justify-center">
    <p className="text-xs mb-2 text-center">
      Photos {images.length}/5 - You can add up to 5 photos.
    </p>

    <div
      onClick={() => imageInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragOut}
      className={cn(
        "bg-zinc-200 rounded-lg relative border border-zinc-400/80 text-sm flex items-center justify-center aspect-video w-full",
        { "border-dashed border-4": draggedOver },
      )}
    >
      <input
        ref={imageInputRef}
        onChange={(e) => {
          if (e.target.files) {
            if (e.target.files.length > 5) {
              e.target.value = "";
              return toast.error("Only a maximum of 5 images is allowed");
            }
            const fileArr = Array.from(e.target.files);
            const mapped = fileArr.map((f) => ({
              file_path: URL.createObjectURL(f),
            }));
            setImages(mapped);
          }
        }}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        name="file_path"
        required
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 p-2 w-full">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.file_path}
              className="h-24 w-full object-cover rounded"
              alt={`preview-${i}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Image className="w-8 h-8" />
          <span>Drag, Drop, and Upload Your Photo</span>
        </div>
      )}
    </div>
  </div>
</div>

			
			{/* other form fields ... */}
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
					<label className="text-sm mb-1">Category</label>
					<Select
						variant="bordered"
						className="[&_button]:border-1 [&_button]:border-zinc-400 [&_button]:rounded-full [&_button]:w-full [&_button]:justify-start [&_button]:px-4 [&_button]:gap-2 [&_button]:min-w-0 [&_div[data-slot='listboxWrapper']]:min-w-full"
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

				{isResellType && (
  <div className="space-y-2">
    <label htmlFor="resell_budget" className="flex items-center gap-2">
      <span>Budget Amount for Reselling (₦)</span>

      {/* Info / Explanation Button */}
      <button
        type="button"
        onClick={budgetInfoModal.onOpen}
        className="text-primary underline text-xs"
      >
        What is this?
      </button>
    </label>

    <div className="flex gap-2 border p-2 rounded-full border-zinc-400">
      <span className="font-medium text-base">₦</span>
      <input
        {...register("resell_budget", {
          required: "Budget amount is required for resell products",
          min: { value: 1, message: "Budget must be greater than 0" },
          pattern: {
            value: /^\d+$/,
            message: "Enter a valid number",
          },
        })}
        type="number"
        min={1}
        placeholder="e.g. 100,000"
        className="outline-none placeholder:text-xs flex-1"
      />
    </div>

    {errors["resell_budget"] && (
      <small className="text-danger">
        {errors["resell_budget"].message as string}
      </small>
    )}
  </div>
)}


				{/*<div className="pt-2">
					<label className="text-sm mb-1">Payment method</label>
					<Select
						variant="bordered"
						placeholder="Select payment method"
						className="[&_button]:border-1 [&_button]:border-zinc-400 [&_button]:rounded-full [&_button]:w-full [&_button]:justify-start [&_button]:px-4 [&_button]:gap-2 [&_button]:min-w-0 [&_div[data-slot='listboxWrapper']]:min-w-full"
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
				</div>*/}
			</div>

			{/*<div className="text-sm space-y-4">
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
			</div>*/}

			<GradientHeader>Contact Information (Optional)</GradientHeader>

			<div className="text-sm space-y-4">
				<div className="space-y-2">
					<label htmlFor="phone_number">Whatsapp Number</label>
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
							{...register("email", {
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

            {/* Budget Explanation Modal */}
<Modal isOpen={budgetInfoModal.isOpen} onOpenChange={budgetInfoModal.onOpenChange}>
  <ModalContent>
    <ModalBody className="text-center p-6 space-y-4">

      <h3 className="text-lg font-semibold">What is the Resell Budget Amount?</h3>

      <p className="text-sm text-zinc-600 leading-normal">
        The <b>resell budget amount</b> is the total money you set aside to 
        <b>pay commissions to resellers</b> for each successful conversion.
      </p>

      <p className="text-sm text-zinc-600 leading-normal">
        Each time a reseller successfully brings a buyer who completes a conversion, 
        the <b>commission amount</b> you set (e.g., ₦500) will be 
        <b>deducted from your product’s budget balance</b>.
      </p>

      <p className="text-sm text-zinc-600">
        <b>Example:</b><br />
        If the reseller commission is <b>₦500</b> and a reseller brings a conversion, 
        then <b>₦500 will be deducted</b> from your product’s budget balance.
      </p>

      <button
        className="px-4 py-2 bg-primary text-white rounded-lg"
        onClick={budgetInfoModal.onClose}
      >
        Got it
      </button>

    </ModalBody>
  </ModalContent>
</Modal>


			{/* preview modal */}
        
			<ListingPreviewModal
				{...modalProps}
				getValues={getValues}
				product_images={images}
				submitForm={submitForm}
				setIsSubmitting={setIsSubmitting}
				resell_budget={getValues().resell_budget}
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
		product_images: { file_path: string }[];
		submitForm(): Promise<any>;
		getValues(): any;
		setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
		resell_budget?: any;
	},
) {
	const successModalProps = useDisclosure();

	return (
		<>
			<Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} onClose={props.onClose}>
				<ModalContent>
					{(onClose: () => any) => (
						<ModalBody className="flex flex-col gap-4 justify-center items-center text-center p-4">
							<p>Preview your listing before publishing. This is how other users will see it:</p>

							<ProductCard
								{...{
									...(props.getValues() as Product),
									product_images: props.product_images,
								}}
							/>

							<div className="space-x-4">
								<button
									onClick={async () => {
										onClose(); // close preview modal
										try {
											await props.submitForm();
											successModalProps.onOpen(); // open success modal
										} catch {
											toast.error("❌ Product listing failed. Please try again.");
										}
									}}
									className="px-4 py-1.5 text-sm rounded-full bg-primary text-white"
									type="button"
								>
									Confirm & Publish
								</button>
								<button
									onClick={onClose}
									className="px-4 py-1.5 text-sm rounded-full border border-primary text-primary"
									type="button"
								>
									Edit Details
								</button>
							</div>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

			{/* 🚀 Success modal is mounted outside, so it won't unmount when preview closes */}
			<ProductListingSuccessModal {...successModalProps} />
		</>
	);
}



function ProductListingSuccessModal(props: ReturnType<typeof useDisclosure>) {
	const { isOpen, onOpenChange, onClose } = props;

	return (
		<Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
			<ModalContent>
				{(_onClose: () => void) => (
					<ModalBody className="flex flex-col gap-4 items-center justify-center text-center p-6">
						<img src="/images/animated-checkmark.gif" alt="success" />
						<h3 className="text-lg font-semibold">🎉 Your Listing is Live!</h3>
						<p className="text-sm text-zinc-600">
							Your product has been successfully added to the marketplace.
						</p>
						<div className="flex items-center justify-center gap-4 mt-2">
							<Link
								className="bg-primary text-white px-4 py-2 rounded-lg"
								to="/marketplace/listings"
							>
								Go to Dashboard
							</Link>
							<button
								className="border border-primary text-primary px-4 py-2 rounded-lg"
								onClick={_onClose}
							>
								Close
							</button>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}










