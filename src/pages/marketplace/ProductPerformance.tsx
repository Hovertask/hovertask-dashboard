import { ArrowLeft } from "lucide-react";
import MarketplaceAside from "../../components/MarketplaceAside";
import { Link } from "react-router";

export default function ProductPerformancePage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_200px] min-h-full">
			<div className="bg-white shadow p-4 space-y-8">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Track Performance</h1>
						<p className="text-sm text-zinc-500">
							Analyze your product views, clicks, and sales with detailed
							insights to maximize your earnings.
						</p>
					</div>
				</div>
			</div>

			<div className="p-4">
				<MarketplaceAside omitCategories />
			</div>
		</div>
	);
}
