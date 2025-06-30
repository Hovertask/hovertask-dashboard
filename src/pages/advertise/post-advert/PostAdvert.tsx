import AdvertRequestForm from "../components/AdvertRequestForm";
import Hero from "./components/Hero";

export default function PostAdvertPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_182px] gap-4 min-h-full">
			<div className="space-y-16 bg-white overflow-hidden min-h-full rounded-2xl mt-4">
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
