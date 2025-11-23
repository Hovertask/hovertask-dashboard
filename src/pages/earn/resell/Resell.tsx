import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import MarketplaceSearchForm from "../../../shared/components/MarketplaceSearchForm";
import { useState } from "react";
import cn from "../../../utils/cn";
import ProductCard from "../../../shared/components/ProductCard";
import { useDisclosure } from "@heroui/react";
import useProducts from "../../../hooks/useProducts";
import Loading from "../../../shared/components/Loading";
import EmptyMapErr from "../../../shared/components/EmptyMapErr";
import useProductCategories from "../../../hooks/useProductCategories";
import ResellerLinkModal from "../../../shared/components/ResellerLinkModal";
import generateResellerLink from "../../../utils/generateResellerLink";
// import ProductInfoModal from "./components/ProductInfoModal";

export default function ResellPage() {
	const { categories, refresh } = useProductCategories();
	const [currentCategory, setCurrentCategory] = useState<string>("all");
	// removed unused currentlyViewedProduct state (resellerData holds product now)
	const { products, reload } = useProducts();
	const modalProps = useDisclosure();
	const [resellerData, setResellerData] = useState<any>(null);

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
										onButtonClickAction={async () => {
												// prepare reseller data, open reseller modal and prevent navigation
												try {
													const res: any = await generateResellerLink(String(product.id));
													// API shape may be { data: { reseller_url, code } }
													const url = (res && res.data && (res.data.reseller_url || res.data.url)) || `${window.location.origin}/marketplace/p/${product.id}`;
													setResellerData({ product, reseller_url: url });
												} catch (err) {
													console.error("Failed to generate reseller link", err);
													setResellerData({ product, reseller_url: `${window.location.origin}/marketplace/p/${product.id}` });
												}
												modalProps.onOpen();
												return true; // returning true cancels navigation
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

						<ResellerLinkModal
							open={modalProps.isOpen}
							onClose={() => {
								modalProps.onClose();
								setResellerData(null);
							}}
							data={resellerData}
						/>
		</div>
	);
}
