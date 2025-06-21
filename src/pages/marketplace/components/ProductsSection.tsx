import { Link } from "react-router";
import ProductCard from "../../_shared/components/ProductCard";
import type { ProductSectionProps } from "../../../../types";
import cn from "../../../utils/cn";
import { useRef } from "react";
import useDraggable from "../../../hooks/useDraggable";

const ProductsSection = (props: ProductSectionProps) => {
	const {
		heading,
		products,
		vertical,
		startComponent,
		link,
		grid,
		useResponsiveCard,
		loadAsyncProducts,
	} = props;
	const productViewsSection = useRef<HTMLDivElement>(null);
	const { isDragging } = useDraggable(productViewsSection);

	return (
		<div className="space-y-4">
			{heading && (
				<div className="flex items-center justify-between">
					<h2 className="font-medium">{heading}</h2>
					{link && (
						<Link
							to={link}
							className="font-light text-primary text-sm hover:underline"
						>
							View All
						</Link>
					)}
				</div>
			)}
			<div
				className={cn(
					"flex gap-4 rounded-2xl max-w-full no-scrollbar items-center",
					{
						"p-4": !vertical || !startComponent,
						"h-[254px]": !grid,
						"bg-none": startComponent,
						"bg-[#EBEFFF]": !startComponent,
					},
				)}
			>
				{startComponent && (
					<div className="h-fit max-mobile:hidden">{startComponent}</div>
				)}

				<div
					className={cn(
						"gap-y-4 gap-x-2 overflow-x-auto no-scrollbar w-full max-w-full h-full",
						{
							"flex-col": vertical,
							"grid grid-cols-2 max-[320px]:grid-cols-1 sm:grid-cols-3": grid,
							"flex flex-1": !grid,
							"p-4 rounded-[inherit] bg-[#EBEFFF]": startComponent,
							"cursor-grabbing": isDragging && !grid,
							"cursor-grab": !isDragging && !grid,
						},
					)}
					ref={productViewsSection}
				>
					{products.map((product) => (
						<ProductCard
							horizontal={vertical}
							key={product.id}
							{...product}
							responsive={useResponsiveCard}
							linkOverrideURL={`/marketplace/p/${product.id}`}
						/>
					))}
				</div>
			</div>
			{loadAsyncProducts && (
				<div className="flex justify-end">
					<button
						type="button"
						className="flex items-center justify-center rounded-full h-[28.92px] border border-base text-base cursor-pointer text-[14.39px] p-[7.2px]"
					>
						Load more products
					</button>
				</div>
			)}
		</div>
	);
};

export default ProductsSection;
