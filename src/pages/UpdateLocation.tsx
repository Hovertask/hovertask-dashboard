import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import MarketplaceSearchForm from "./_shared/components/MarketplaceSearchForm";
import CustomSelect from "./_shared/components/Select";
import states from "../utils/states";
import { useState } from "react";
import Loading from "./_shared/components/Loading";
import { toast } from "sonner";
import lgas from "../utils/lgas";
import UserProfileCard from "./_shared/components/UserProfileCard";

export default function UpdateLocationPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [location, setLocation] = useState({ state: "", city: "" });

	function simulateLoading() {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			toast.success("Location set successfully!");
		}, 4000);
	}
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-5 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/transactions-history">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Update Your Location</h1>
						<p className="text-sm text-zinc-500">
							Your location helps us connect you with nearby buyers and sellers.
							Update it below to ensure your products reach the right audience
							and you see items close to you for easy purchasing.
						</p>
					</div>
				</div>

				<div>
					<img src="/images/map.png" alt="" />
					<div className="w-fit mx-auto -translate-y-1/2 bg-white rounded-3xl shadow">
						<MarketplaceSearchForm
							placeholder="Search your location"
							style={{ fontSize: 14 }}
						/>
					</div>
				</div>

				<p className="font-light">
					Please choose your state first to enable the selection of your City.
				</p>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						simulateLoading();
					}}
					className="space-y-4"
				>
					<div className="grid grid-cols-2 gap-8">
						<CustomSelect
							label="Region"
							placeholder="Select your region"
							options={states}
							isAutoComplete
							onSelectionChange={(s) =>
								setLocation((prev) => ({ ...prev, state: s as string }))
							}
						/>
						<CustomSelect
							label="City"
							placeholder="Select your city"
							options={
								location.state
									? lgas.find((lga) => lga.state === location.state)?.cities!
									: []
							}
							isAutoComplete
						/>
					</div>

					<button className="bg-primary p-2 rounded-xl text-white transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transition-none text-sm">
						Set Your Location
					</button>
				</form>

				{isLoading && <Loading fixed />}
			</div>

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}
