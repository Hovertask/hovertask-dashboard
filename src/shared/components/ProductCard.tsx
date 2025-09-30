import { useState } from "react";
import { Heart, ShoppingBag, StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { ProductCardProps } from "../../../types";
import cn from "../../utils/cn";
import getPercentageValue from "../../utils/getPercentageValue";

export default function ProductCard(props: ProductCardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const images =
		props.product_images && props.product_images.length > 0
			? props.product_images
			: [{ file_path: "/placeholder.png" }];

	const currentImage = images[currentIndex]?.file_path;

	function goPrev(e: React.MouseEvent) {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	}

	function goNext(e: React.MouseEvent) {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	}

	return (
		<div
			className={cn("flex flex-col bg-white rounded-2xl p-4 space-y-2", {
				"flex-row items-center w-[320px]": props.horizontal,
				"w-[180px] min-w-[180px]": !props.horizontal && !props.responsive,
			})}
		>
			{/* Image / Carousel */}
			<div className="bg-zinc-200 rounded-2xl overflow-hidden relative group">
				<img
					className={cn("aspect-[4/3] block w-full object-cover", {
						"w-[131px]": props.horizontal,
						"h-[97.7px]": !props.horizontal && !props.responsive,
					})}
					src={currentImage}
					alt={props.name}
				/>

				{/* Arrows (only if multiple images) */}
				{images.length > 1 && (
					<>
						<button
							onClick={goPrev}
							className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
						>
							<ChevronLeft size={16} />
						</button>
						<button
							onClick={goNext}
							className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
						>
							<ChevronRight size={16} />
						</button>

						{/* Dots */}
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
							{images.map((_, i) => (
								<span
									key={i}
									className={cn(
										"h-1.5 w-1.5 rounded-full transition",
										i === currentIndex ? "bg-primary" : "bg-white/70"
									)}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{/* Product details */}
			<div className="space-y-2 flex flex-col justify-end flex-1">
				<div>
					<div className="flex justify-between items-start">
						<h3 className="text-[11.28px] capitalize line-clamp-2">{props.name}</h3>
						<button type="button" className="text-[#FF00FB]">
							<Heart size={14} />
						</button>
					</div>
					<div className="flex gap-6">
						{props.discount && props.discount > 0 && (
							<p className="text-[9.4px] text-[#77777A] line-through">
								₦{props.price.toLocaleString()}
							</p>
						)}
						<p className="text-[11.28px]">
							₦
							{props.discount && props.discount > 0
								? Number(getPercentageValue(props.price, props.discount).toFixed(2)).toLocaleString()
								: props.price.toLocaleString()}
						</p>
					</div>
					<div className="flex gap-4 items-center">
						<p className="text-[9.4px] flex items-center">
							<StarIcon size={12} /> {props.rating}
						</p>
						<p className="text-[9.4px] text-primary">({props.reviews_count} Reviews)</p>
						<p className="text-[#77777A] text-[9.11px]">{props.stock} Units</p>
					</div>
				</div>
				<div className="flex items-center justify-between gap-2">
					<button
						type="button"
						onClick={() => {
							if (props.onButtonClickAction) props.onButtonClickAction();
						}}
						className={cn(
							"flex gap-1 justify-center items-center rounded-full h-[27.75px] text-[9.64px] flex-1",
							{
								"border-primary border text-primary bg-white": props.version === "bordered",
								"bg-primary text-white": props.version !== "bordered",
							},
						)}
					>
						<ShoppingBag size={12} />
						{props.buttonText ?? "Buy Product"}
					</button>
					<Link
						to={props.linkOverrideURL ?? `/marketplace/p/${props.id}`}
						className={cn(
							"flex items-center justify-center rounded-full min-h-[28.92px] min-w-[28.92px] border",
							{
								"border-primary text-primary": props.version !== "bordered",
							},
						)}
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
