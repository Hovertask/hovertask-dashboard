import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import MarketplaceSearchForm from "../../../shared/components/MarketplaceSearchForm";
import { useState } from "react";
import cn from "../../../utils/cn";
import ProductCard from "../../../shared/components/ProductCard";
import type { Product } from "../../../../types";
import { useDisclosure } from "@heroui/react";
import useProducts from "../../../hooks/useProducts";
import Loading from "../../../shared/components/Loading";
import EmptyMapErr from "../../../shared/components/EmptyMapErr";
import useProductCategories from "../../../hooks/useProductCategories";
import ProductInfoModal from "./components/ProductInfoModal";

export default function ResellPage() {
	const { categories, refresh } = useProductCategories();
	const [currentCategory, setCurrentCategory] = useState<string>("all");
	const [currentlyViewedProduct, setCurrentlyViewedProduct] =
		useState<Product>();
	const { products, reload } = useProducts();
	const modalProps = useDisclosure();

	return (
		<div className="grid min-[1000px]:grid-cols-[1fr_200px] min-h-full gap-4">
			<div className="shadow min-h-full bg-white p-4 space-y-12">
				<div
					style={{ backgroundImage: "url('/images/Rectangle 39253.png')" }}
					className="bg-cover p-4 space-y-24 rounded-3xl max-w-full"
				>
					<div className="flex gap-4 flex-1 text-white">
						<Link to="/earn">
							<ArrowLeft />
						</Link>

						<div className="space-y-2">
							<h1 className="text-xl font-medium">
								Hot-selling Products to Maximize Your Earnings
							</h1>
							<p className="text-sm">
								Get access to high-demand products and services at discounted
								rates, resell, and earn profits instantly!
							</p>
						</div>
					</div>

					<div className="flex justify-center">
						<MarketplaceSearchForm />
					</div>
				</div>

				<div className="space-y-2">
					<h2 className="font-medium text-lg">All Categories</h2>

					<div className="flex gap-2 flex-wrap">
						{categories ? (
							categories.map((category) => (
								<button
									type="button"
									onClick={() => setCurrentCategory(category.key)}
									className={cn(
										"py-1 px-2 rounded-lg bg-zinc-200 border border-zinc-300 text-sm capitalize",
										{
											"bg-primary text-white transition-all active:scale-95":
												category.key === currentCategory,
										},
									)}
									key={category.key}
								>
									{category.label}
								</button>
							))
						) : categories === null ? (
							<Loading />
						) : (
							<EmptyMapErr
								onButtonClick={refresh}
								description="Failed to load product categories."
								buttonInnerText="Try Again"
							/>
						)}
					</div>
				</div>

				<div className="space-y-5">
					<h2 className="font-medium text-lg">Top Products to Buy or Resell</h2>

					{products ? (
						products.length ? (
							<div className="grid max-[380px]:grid-cols-1 max-[640px]:grid-cols-2 sm:grid-cols-3 p-4 rounded-3xl bg-primary/20 gap-x-2 gap-y-4">
								{products?.map((product) => (
									<ProductCard
										responsive
										key={product.id}
										{...product}
										onButtonClickAction={() => {
											setCurrentlyViewedProduct(product);
											modalProps.onOpen();
										}}
									/>
								))}
							</div>
						) : (
							<EmptyMapErr
								description="No products have been added yet"
								buttonInnerText="Refresh"
								onButtonClick={reload}
							/>
						)
					) : (
						<Loading />
					)}
				</div>

				<div>
					<img src="/images/Group 1000004391.png" alt="" />
				</div>
			</div>

			{products && (
				<div>
					<div className="p-4 bg-primary bg-opacity-20 max-[1000px]:hidden text-xs rounded-2xl mt-[552px] space-y-3">
						<img
							src="/images/Why_wait__Shop_the_latest_trends_and_essentials_on_-removebg-preview 2.png"
							alt=""
						/>
						<p>
							Add a new product or service to the marketplace. Include details,
							set your price, and upload images to attract buyers.
						</p>
						<Link
							to="/marketplace/list-product"
							className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-primary text-white w-full justify-center"
						>
							<ShoppingBag size={12} /> List a New Product
						</Link>
					</div>
				</div>
			)}

			<ProductInfoModal {...modalProps} product={currentlyViewedProduct} />
		</div>
	);
}
