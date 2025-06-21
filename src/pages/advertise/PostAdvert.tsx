import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import AdvertRequestForm from "./components/AdvertRequestForm";

export default function PostAdvertPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="space-y-16 overflow-hidden min-h-full rounded-2xl mt-4">
				<Hero />
				<div className="text-center max-w-lg mx-auto p-6">
					<h2 className="text-lg font-medium">Post a New Advert Request</h2>
					<p className="text-sm">
						Submit your advert request and receive multiple bids from bests
						workers ready to deliver.
					</p>
				</div>

				<AdvertRequestForm />
			</div>
		</div>
	);
}

function Hero() {
	return (
		<div className="bg-gradient-to-r from-white via-primary/30 to-white px-4 pt-4 rounded-2xl">
			<div className="flex gap-6 max-mobile:gap-4">
				<Link to="/">
					<ArrowLeft />
				</Link>

				<div className="flex justify-center items-center">
					<div>
						<img
							src="/images/Premium_Photo___Composition_with_smartphone_used_for_digital_shopping_and_online_ordering-removebg-preview 2.png"
							width={250}
							alt=""
						/>
					</div>
					<h1 className="text-2xl text-primary text-center">
						Advertise on <br /> Social Media
					</h1>
				</div>
			</div>
		</div>
	);
}
