import { ArrowLeft, CreditCard, Minus, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import useCartItem from "../../hooks/useCartItem";
import { toast } from "sonner";
import { CartProduct } from "../../../types";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../../redux/slices/cart";
import getPercentageValue from "../../utils/getPercentageValue";
import Loading from "../_shared/components/Loading";
import useSeller from "../../hooks/useProductSeller";
import SellerInfoAside from "../_shared/components/SellerInfoAside";

export default function ProductCheckoutPage() {
	const { id } = useParams();
	const product = useCartItem(id!);
	const navigate = useNavigate();
	const seller = useSeller(id!);

	if (!product) {
		toast.error("This item has not yet been added to cart");
		navigate(`/marketplace/p/${id}`);
		return null;
	}

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="px-4 py-8 space-y-8 overflow-hidden">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace/cart">
						<ArrowLeft />
					</Link>

					<h1 className="text-xl font-medium">Product Checkout</h1>
				</div>

				{product && seller ? (
					<div>
						<CartItemCard {...product} />
						<ChooseOnlinePaymentMethodPage />.
					</div>
				) : (
					<Loading />
				)}
			</div>

			<div className="space-y-20 max-mobile:space-y-6">
				{seller && <SellerInfoAside {...seller} />}

				<div className="p-4">
					<div className="text-sm space-y-3 bg-white/70 p-4 rounded-3xl">
						<h4>Order summary</h4>
						<div className="space-y-1">
							<p className="flex justify-between">
								Items Total({product.cartQuantity}):{" "}
								<span className="font-medium">
									{" "}
									₦
									{(product.discount
										? (product.price -
												(product.price * product.discount) / 100) *
											product.cartQuantity
										: product.cartQuantity * product.price
									).toFixed(2)}
								</span>
							</p>
							<p className="flex justify-between">
								Shipping fee:{" "}
								<span className="font-medium">
									₦{product.delivery_fee || 0.0}
								</span>
							</p>
						</div>

						<hr />

						<p className="flex justify-between">
							Net Total:{" "}
							<span className="font-medium">
								₦
								{product.discount
									? (
											getPercentageValue(product.price, product.discount) *
											product.cartQuantity
										).toFixed(2)
									: (product.price * product.cartQuantity).toFixed(2)}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function CartItemCard(props: CartProduct) {
	const dispatch = useDispatch();

	return (
		<div className="flex bg-white rounded-2xl space-y-2 shadow-md p-6 gap-4 max-sm:flex-col max-sm:items-stretch items-center">
			<div className="bg-zinc-200 rounded-2xl overflow-hidden">
				<img
					className="aspect-[4/3] block"
					src={props.images && props.images[0]}
					alt={props.name}
				/>
			</div>
			<div className="space-y-2 flex flex-col justify-end flex-1">
				<div>
					<h3 className="text-lg capitalize line-clamp-2 font-medium">
						{props.name}
					</h3>
					<div className="flex gap-6">
						<p className="text-sm text-[#77777A] line-through">
							₦{props.price}
						</p>
						<p>
							₦
							{props.discount
								? Number(
										getPercentageValue(props.price, props.discount).toFixed(2),
									).toLocaleString()
								: props.price.toLocaleString()}
						</p>
					</div>
					<p className="flex gap-4 items-center text-sm">
						Seller: <span className="text-zinc-700">Onah Victor</span>
					</p>
				</div>
				<div className="flex items-center gap-2 bg-primary p-2 rounded-full justify-between text-white text-sm">
					<button
						onClick={() =>
							dispatch(updateQuantity({ direction: 0, id: props.id }))
						}
						disabled={props.cartQuantity <= 1}
						className="disabled:cursor-not-allowed"
					>
						<Minus />
					</button>
					<span>{props.cartQuantity} Added</span>
					<button
						onClick={() =>
							dispatch(updateQuantity({ direction: 1, id: props.id }))
						}
					>
						<Plus />
					</button>
				</div>
			</div>
		</div>
	);
}

function ChooseOnlinePaymentMethodPage() {
	const paymentOptions = [
		{
			title: "MasterCard / Visa / Verver Card",
			description: "Pay instantly with your credit or debit card",
			icon: <CreditCard size={32} />,
			link: "#",
			linkText: "Pay with Card",
		},
		{
			title: "Bank Transfer (USSD)",
			description: "Transfer funds using your bank's USSD code",
			icon: <span className="text-3xl font-medium">₦</span>,
			link: "#",
			linkText: "Pay via USSD",
		},
		{
			title: "Internet Banking Transfer",
			description:
				"Make a transfer using your bank's mobile or internet banking app",
			icon: <InternetBankTransferIcon />,
			link: "#",
			linkText: "Make Transfer",
		},
	];

	return (
		<div className="px-4 py-6 space-y-3 bg-white shadow-md rounded-2xl">
			<div className="space-y-1">
				<h1 className="text-xl font-medium">Choose An Online Payment Method</h1>
				<p className="text-sm text-zinc-500">
					Select how you'd like to pay online
				</p>
			</div>

			<div className="space-y-3">
				{paymentOptions.map((option, i) => (
					<PaymentOptionCard key={i} {...option} />
				))}
			</div>
		</div>
	);
}

function PaymentOptionCard(props: {
	icon: React.ReactNode;
	title: string;
	description: string;
	link: string;
	linkText: string;
}) {
	const { icon, title, description, link, linkText } = props;

	return (
		<div className="flex items-center gap-4 border-1 border-primary rounded-3xl py-4 px-4 mobile:px-8 max-sm:flex-col">
			<div>{icon}</div>
			<div className="flex-1">
				<p className="text-lg font-medium">{title}</p>
				<p className="text-sm text-gray-500">{description}</p>
			</div>
			<Link
				to={link}
				className="bg-primary text-sm px-4 py-2 rounded-xl text-white"
			>
				{linkText}
			</Link>
		</div>
	);
}

function InternetBankTransferIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M13.3337 5.33337C8.30566 5.33337 5.79099 5.33337 4.22966 6.89604C2.66833 8.45871 2.66699 10.972 2.66699 16C2.66699 21.028 2.66699 23.5427 4.22966 25.104C5.79233 26.6654 8.30566 26.6667 13.3337 26.6667H15.3337M18.667 5.33337C23.695 5.33337 26.2097 5.33337 27.771 6.89604C29.1897 8.31337 29.3203 10.5147 29.3337 14.6667"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M20.6667 18.6667V26.6667M20.6667 26.6667L23.3333 24.0001M20.6667 26.6667L18 24.0001M26.6667 26.6667V18.6667M26.6667 18.6667L29.3333 21.3334M26.6667 18.6667L24 21.3334"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13.3337 21.3334H8.00033M2.66699 13.3334H9.33366M29.3337 13.3334H14.667"
				stroke="black"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</svg>
	);
}
