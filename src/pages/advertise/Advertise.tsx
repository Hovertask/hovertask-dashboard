import { ArrowLeft, History, Hexagon, Megaphone } from "lucide-react";
import { Link } from "react-router";
import { useDisclosure } from "@heroui/react";
import type { AuthUserDTO } from "../../../types";
import { useSelector } from "react-redux";
import InsufficientFundsModal from "../../components/InsufficientFundsModal";
import AdvertCard from "./components/AdvertCard";
import advertTypes from "./utils/advertTypes";
import advertFeatures from "./utils/advertFeatures";
import FeatureCard from "./components/FeatureCard";

export default function AdvertisePage() {
	const modalProps = useDisclosure();
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
				<Hero />

				<div className="space-y-6">
					<p className="text-sm text-center">
						Advertise your products and services to thousands of active users on
						our website and mobile app every day. Her's why placing your adverts
						on Hovertask Market Place is the best decision for your business:
					</p>

					<div className="grid grid-cols-2 gap-4 gap-y-8">
						{advertFeatures.map((feature) => (
							<FeatureCard key={feature.title} {...feature} />
						))}
					</div>
				</div>

				<div className="space-y-6">
					<div className="w-fit mx-auto flex items-center gap-2 py-2 px-4 rounded-full border-b border-zinc-400 -rotate-6">
						<History size={18} /> Advert Duration
					</div>

					<p className="bg-primary text-white p-4 rounded-2xl text-sm text-center">
						Your advert will stay visible on our platform for 1 month. After
						this period, you'll need to renew by placing another advert to
						maintain visibility.
					</p>

					<p className="text-sm text-center font-medium">
						Take advantage of Hovertask today and sell faster than ever!
					</p>

					<div className="flex items-center gap-4 justify-between py-2 px-6 border border-zinc-400 rounded-full max-w-sm mx-auto">
						<span className="text-xl font-medium">₦1,000</span>
						<button
							type="button"
							onClick={() => authUser.balance >= 1000 || modalProps.onOpen()}
							className="px-4 py-2 rounded-2xl text-sm text-white bg-primary active:scale-95 transition-transform"
						>
							Continue
						</button>
					</div>
				</div>

				<InsufficientFundsModal {...modalProps} />

				<div className="space-y-6">
					<div className="max-w-sm mx-auto flex items-center gap-4 p-4 rounded-3xl border-b border-primary overflow-x-auto">
						<button
							type="button"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all bg-primary text-white"
						>
							<Hexagon className="h-4 w-4" /> Advert Tasks
						</button>
						<Link
							to="/advertise/engagement-tasks"
							className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all text-primary"
						>
							<Megaphone className="h-4 w-4" /> Engagement Tasks
						</Link>
					</div>

					<p className="text-sm text-center">
						Pay users to perform specific actions that increase the reach and
						visibility of your content. From likes to shares, get the engagement
						you need to grow your brand.
					</p>

					<div className="space-y-4">
						{advertTypes.map((ad) => (
							<AdvertCard key={ad.platform} {...ad} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function Hero() {
	return (
		<div className="bg-gradient-to-r from-white via-primary/30 to-white p-4 rounded-2xl">
			<div className="flex gap-6 max-mobile:gap-4">
				<Link to="/">
					<ArrowLeft />
				</Link>

				<div className="text-center">
					<h1 className="font-medium text-xl text-primary">
						Advertise anything Faster on Hovertask Marketplace
					</h1>
					<p className="text-sm">
						Promote your products and services to thousands of daily users on
						our platform and reach a wider audience across social media. Boost
						your sales and grow your business today!
					</p>
				</div>
			</div>

			<div className="flex justify-center">
				<img
					src="/images/7_Places_To_Shop_Online_On_A_Budget-removebg-preview 2.png"
					width={250}
					alt=""
				/>
			</div>
		</div>
	);
}
