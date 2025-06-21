import { Link, useParams } from "react-router";
import CarouselAdBanner from "../_shared/components/CarouselAdBanner";
import { ArrowLeft } from "lucide-react";
import ProductsSection from "./components/ProductsSection";
import { useSelector } from "react-redux";
import { Product } from "../../../types";
import MarketplaceAside from "./components/MarketplaceAside";

export default function CategoryPage() {
	const products = useSelector<any, Product[]>(
		(state: any) => state.products.value,
	);
	const { category } = useParams<{ category: string }>();
	const headerCategoryMap: { [key: string]: string } = {
		trending: "Trending Products and Services",
		"best-deals-and-services": "Best Deals and Services",
		"trending-womens-wear": "Trending Women's Wear",
		"hottest-deal-services": "Hottest Deal Services",
	};
	const categoryKeys = [
		"trending",
		"best-deals-and-services",
		"trending-womens-wear",
		"hottest-deal-services",
	].filter((c) => c != category);
	const randomCategory =
		categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
	const extraCategoryHeading = headerCategoryMap[randomCategory];

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="min-h-full shadow bg-white p-4 space-y-8 overflow-hidden">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<div>
						<h1 className="text-xl font-medium">
							Welcome to Hovertask Marketplace
						</h1>
						<p className="text-sm text-zinc-500">
							Your one-stop platform to buy, sell, and earn effortlessly.
						</p>
					</div>
				</div>

				<ProductsSection
					heading={headerCategoryMap[category as string]}
					products={products}
					useResponsiveCard
					grid
				/>

				<CarouselAdBanner />

				<ProductsSection
					products={products}
					heading={extraCategoryHeading}
					link={`/marketplace/c/${randomCategory}`}
				/>
			</div>

			<div>
				<MarketplaceAside />
			</div>
		</div>
	);
}
