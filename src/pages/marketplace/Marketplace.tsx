import { Link } from "react-router";
import MarketplaceSearchForm from "../../shared/components/MarketplaceSearchForm";
import { ArrowLeft } from "lucide-react";
import ProductsSection from "./components/ProductsSection";
import CarouselAdBanner from "../../shared/components/CarouselAdBanner";
import MarketplaceAside from "./components/MarketplaceAside";
import useProducts from "../../hooks/useProducts";
import Loading from "../../shared/components/Loading";
import EmptyMapErr from "../../shared/components/EmptyMapErr";

export default function MarketplacePage() {
	const { products, reload } = useProducts();

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="min-h-full shadow bg-white p-4 space-y-8 overflow-hidden">
				<div className="flex gap-4 flex-1">
					<Link to="/">
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

				<Hero />

				<p className="text-sm text-zinc-700">
					Discover trending products and services or showcase yours to thousands
					of buyers daily.
				</p>

				{products ? (
					products.length > 0 ? (
						<>
							<ProductsSection
								products={products}
								heading="Trending Products and Services"
								link="/marketplace/c/trending"
							/>

							<ProductsSection
								products={products}
								startComponent={
									<img src="/images/Group 1000004394.png" width={150} alt="" />
								}
							/>

							<CarouselAdBanner />

							<ProductsSection
								heading="Best Deals and Services"
								products={products}
								link="/marketplace/c/best-deals-and-services"
							/>

							<ProductsSection
								heading="Trending Women's Wear"
								products={products}
								link="/marketplace/c/trending-womens-wear"
							/>

							<ProductsSection
								products={products}
								startComponent={
									<img src="/images/Group 1000004396.png" width={150} alt="" />
								}
							/>

							<ProductsSection
								heading="Hottest Deal Services"
								products={products}
								link="/marketplace/c/hottest-deal-services"
							/>

							<CarouselAdBanner />
						</>
					) : (
						<EmptyMapErr
							buttonInnerText="Reload"
							description="No products available yet"
							onButtonClick={reload}
						/>
					)
				) : (
					<Loading />
				)}
			</div>

			<div>
				<MarketplaceAside />
			</div>
		</div>
	);
}

function Hero() {
	return (
		<div className="min-h-[348px] rounded-3xl relative overflow-hidden flex flex-col justify-end gap-8 z-0 p-8">
			<img
				src="/images/image 3.png"
				alt="Hero"
				className="absolute inset-0 z-0 h-full w-full"
			/>
			<div className="max-w-sm p-4 bg-gradient-to-r from-black to-transparent z-10 text-2xl font-extrabold text-white">
				Connect, Trade, and Earn on Hovertask Market Place.
			</div>

			<div className="w-full z-10 flex justify-end">
				<MarketplaceSearchForm />
			</div>
		</div>
	);
}
