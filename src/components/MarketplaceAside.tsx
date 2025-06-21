import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import useProductCategories from "../hooks/useProductCategories";
import Loading from "../pages/_shared/components/Loading";
import EmptyMapErr from "../pages/_shared/components/EmptyMapErr";

export default function MarketplaceAside({
	omitCategories,
}: { omitCategories?: boolean }) {
	const [currentCategory, setCurrentCategory] = useState<string>("all");
	let categories, refresh;

	if (!omitCategories) {
		({ categories, refresh } = useProductCategories());
	}

	return (
		<div className="mt-24 space-y-10 max-lg:hidden">
			{!omitCategories && (
				<div className="border-1 border-[#66666666] rounded-3xl p-6 space-y-6">
					<div>
						<h3>Explore Our Categories</h3>
						<p className="text-xs font-light text-secondary">
							Find what you need, from gadgets to services, all in one place.
						</p>
					</div>
					<SearchForm />
					<div className="space-y-2">
						{categories ? (
							categories.length > 0 ? (
								categories.map((category) => (
									<button
										onClick={() => setCurrentCategory(category.key)}
										className={`${
											currentCategory == category.key
												? "bg-primary text-white"
												: "bg-[#EBEBEB]"
										} border-1 border-zinc-300 py-1 px-2 rounded-xl whitespace-nowrap text-sm`}
										key={category.key}
									>
										{category.label}
									</button>
								))
							) : (
								<EmptyMapErr
									onButtonClick={refresh}
									description="No product categories available yet"
									buttonInnerText="Reload Categories"
								/>
							)
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
			)}

			<div className="p-4 bg-primary bg-opacity-20 max-[1000px]:hidden text-xs rounded-2xl space-y-3">
				<img
					src="/images/Why_wait__Shop_the_latest_trends_and_essentials_on_-removebg-preview 2.png"
					alt=""
				/>
				<p>
					Add a new product or service to the marketplace. Include details, set
					your price, and upload images to attract buyers.
				</p>
				<Link
					to="/marketplace/list-product"
					className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-primary text-white w-full justify-center"
				>
					<ShoppingBag size={12} /> List a New Product
				</Link>
			</div>
		</div>
	);
}

function SearchForm() {
	return (
		<form>
			<label htmlFor="location" className="text-xs">
				Select location
			</label>
			<div className="flex bg-white py-1 px-4 rounded-full border-1 border-[#00000033] items-center">
				<span
					style={{ fontSize: 14 }}
					className="material-icons-outlined text-zinc-600"
				>
					location_on
				</span>
				<input type="text" className="min-w-0" />
			</div>
		</form>
	);
}
