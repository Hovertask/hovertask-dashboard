import { ArrowLeft, ShoppingBag, StarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Product } from "../../../types";

export default function CartPage() {
	const cartItems = useSelector<any, Product[]>(
		(state: any) => state.cart.value,
	);

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-8 overflow-hidden">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<h1 className="text-xl font-medium">Cart</h1>
				</div>

				<hr className="border-dashed" />

				<div className="space-y-4">
					{cartItems.map((product) => (
						<CartItemCard {...product} />
					))}
				</div>
			</div>
		</div>
	);
}

function CartItemCard(props: Product) {
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
										(props.price * (props.discount / 100)).toLocaleString(),
									).toFixed(2)
								: props.price.toLocaleString()}
						</p>
					</div>
					<div className="flex gap-4 items-center text-sm">
						<p className="flex items-center">
							<StarIcon size={12} /> {props.rating}
						</p>
						<p className="text-primary">({props.reviews_count} Reviews)</p>
						<p className="text-[#77777A]">{props.stock} Units</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Link
						to={`/marketplace/checkout/${props.id}`}
						className="flex gap-1 justify-center items-center rounded-full px-4 py-1.5 text-xs bg-primary text-white max-sm:flex-1"
					>
						<ShoppingBag size={12} />
						Buy Product
					</Link>
					<Link
						to={`/marketplace/p/${props.id}`}
						className="flex items-center justify-center rounded-full min-h-[28.92px] min-w-[28.92px] border border-primary text-primary"
					>
						<span style={{ fontSize: 16 }} className="material-icons-outlined">
							north_east
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
