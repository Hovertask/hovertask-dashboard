import { useRef } from "react";
import useProducts from "../../../hooks/useProducts";
import useDraggable from "../../../hooks/useDraggable";
import Loading from "../../../shared/components/Loading";
import EmptyMapErr from "../../../shared/components/EmptyMapErr";
import cn from "../../../utils/cn";
import ProductCard from "../../../shared/components/ProductCard";

export default function PopularProducts() {
	const { products, reload } = useProducts();
	const productsContainer = useRef<HTMLDivElement>(null);
	const { isDragging } = useDraggable(productsContainer);

	return (
		<div className="space-y-3">
			<h2 className="text-[20.8px]">Popular Products</h2>

			{!products && <Loading />}

			{/* No products to show */}
			{products && !products.length && (
				<EmptyMapErr
					description="No products are available yet"
					buttonInnerText="Reload Products"
					onButtonClick={reload}
				/>
			)}

			{products?.length ? (
				<div
					ref={productsContainer}
					className={cn(
						"flex gap-4 overflow-x-auto bg-primary/30 p-4 rounded-3xl w-full",
						{
							"cursor-grabbing": isDragging,
							"cursor-grab": !isDragging,
						},
					)}
				>
					{products.map((product) => (
						<ProductCard
							{...product}
							key={product.name}
							version="bordered"
							buttonText="Check Product"
						/>
					))}
				</div>
			) : null}
		</div>
	);
}
