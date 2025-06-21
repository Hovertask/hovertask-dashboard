import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import cn from "../../utils/cn";
import MarketplaceAside from "./components/MarketplaceAside";

export default function ProductListingsPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_200px] min-h-full">
			<div className="bg-white shadow p-4 space-y-8">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">View Product Listings</h1>
						<p className="text-sm text-zinc-500">
							Manage all your listed products. Edit details, update stock, and
							track live status
						</p>
					</div>
				</div>

				<ProductStatusSummary />
				<hr className="border-dashed" />
				<ProductList />
			</div>

			<div className="p-4">
				<MarketplaceAside omitCategories />
			</div>
		</div>
	);
}

function ProductStatusSummary() {
	const stats = [
		{ label: "Active", count: 12, active: true },
		{ label: "Inactive", count: 3 },
		{ label: "Pending", count: 0 },
		{ label: "In Review", count: 0 },
		{ label: "Failed", count: 0 },
	];

	return (
		<div className="bg-gradient-to-b from-primary/10 to-white rounded-2xl p-4 border border-zinc-200 w-full max-w-4xl mx-auto">
			<div className="text-sm font-medium mb-4">
				Total Products Listed:{" "}
				<span className="text-primary font-medium">15</span>
			</div>
			<div className="flex flex-wrap gap-3">
				{stats.map((item) => (
					<div
						key={item.label}
						className={cn(
							"rounded-xl px-4 py-2 text-sm font-medium w-24 flex-1",
							{
								"bg-primary/10 text-black": item.active,
								"border border-zinc-200 text-gray-800 bg-white": !item.active,
							},
						)}
					>
						<div className="text-md font-semibold">{item.count}</div>
						<div className="text-xs">{item.label}</div>
					</div>
				))}
			</div>
		</div>
	);
}

function ProductList() {
	const statuses = ["Active", "Inactive"];
	const statusStyles = {
		Active: "text-green-600",
		Inactive: "bg-yellow-100 text-gray-800 px-2 py-0.5 rounded-sm text-xs",
	};

	const sampleProducts = [
		{
			name: "Fashion Luxury Bag",
			price: 26000,
			stock: true,
			image: "https://via.placeholder.com/60x60.png?text=Bag",
		},
		{
			name: "Wireless Headphones",
			price: 18500,
			stock: false,
			image: "https://via.placeholder.com/60x60.png?text=Headphones",
		},
		{
			name: "Smart Wrist Watch",
			price: 34000,
			stock: true,
			image: "https://via.placeholder.com/60x60.png?text=Watch",
		},
		{
			name: "Sneaker Set",
			price: 29500,
			stock: true,
			image: "https://via.placeholder.com/60x60.png?text=Sneakers",
		},
		{
			name: "Mini Bluetooth Speaker",
			price: 9000,
			stock: false,
			image: "https://via.placeholder.com/60x60.png?text=Speaker",
		},
	];

	// Randomize status for demo purposes
	const getRandomStatus = () =>
		statuses[Math.floor(Math.random() * statuses.length)];

	return (
		<div className="space-y-4">
			{sampleProducts.map((product) => {
				const status = getRandomStatus();
				return (
					<div
						key={product.name}
						className="flex justify-between items-center bg-white p-4 rounded-3xl shadow"
					>
						{/* Left: Image and Info */}
						<div className="flex items-center gap-4">
							<img
								src={product.image}
								alt={product.name}
								className="w-14 h-14 rounded"
							/>
							<div>
								<h3 className="font-medium text-sm">{product.name}</h3>
								<p className="text-sm text-gray-700 font-medium">
									₦{product.price.toLocaleString()}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs text-gray-500">
										{product.stock ? "In Stock" : "Out of Stock"}
									</span>
									<Link
										to="/marketplace/performance"
										className="bg-primary text-white text-xs px-2 py-1 rounded-full"
									>
										Track Product Performance
									</Link>
								</div>
							</div>
						</div>

						{/* Right: Status + Actions */}
						<div className="text-right space-y-1 text-xs flex flex-col justify-between self-stretch">
							<div
								className={cn(
									statusStyles[status as keyof typeof statusStyles],
									"rounded-lg w-fit",
								)}
							>
								{status}
							</div>
							<div className="flex gap-3 justify-end">
								<button type="button" className="text-blue-600 hover:underline">
									Edit
								</button>
								{status === "Inactive" && (
									<button
										type="button"
										className="text-green-600 hover:underline"
									>
										Activate
									</button>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
