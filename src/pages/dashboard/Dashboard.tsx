import { ChevronDown, DollarSign, Wallet } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import type { AuthUserDTO } from "../../../types";
import Carousel from "../../components/Carousel";
import EmptyMapErr from "../_shared/components/EmptyMapErr";
import Loading from "../_shared/components/Loading";
import ProductCard from "../../components/ProductCard";
import useDraggable from "../../hooks/useDraggable";
import useProducts from "../../hooks/useProducts";
import cn from "../../utils/cn";
import AvailableTasks from "../_shared/components/AvailableTasks";
import BecomeMemberModal from "./components/BecomeAMemberModal";
import ContactGainModal from "./components/ContactGainModal";
import autoVerifyAccountActivation from "./utils/autoVerifyAccountActivation";
import requestVerificationEmail from "./utils/requestVerificationEmail";

export default function Dashboard() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<>
			<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
				<div className="px-4 py-10 space-y-12 bg-white shadow min-h-full lg:max-w-[573px] overflow-x-hidden">
					<Greeting
						lname={authUser.lname}
						how_you_want_to_use={authUser.how_you_want_to_use}
					/>
					<BalanceBoard balance={authUser.balance} />
					<WelcomeMessage {...authUser} />
					<AvailableTasks mode="preview" />
					<Carousel>
						<img src="/images/Group 1000004390.png" alt="" />
						<img src="/images/Group 1000004393.png" alt="" />
						<img src="/images/Group 1000004395.png" alt="" />
					</Carousel>
					<AdBanner />
					<PopularProducts />
				</div>
			</div>

			{/* Modals */}
			<BecomeMemberModal />
			<ContactGainModal />
		</>
	);
}

function Greeting({
	lname,
	how_you_want_to_use,
}: { lname?: string; how_you_want_to_use?: string }) {
	return (
		<div className="flex justify-between">
			<h1 className="text-[18.66px] font-light">
				Welcome back, <br />
				<span className="capitalize font-normal">{lname}</span>
			</h1>
			<div className="bg-[#10AF88] text-white py-1.5 px-3 rounded-lg inline-flex items-center gap-2 text-sm h-fit">
				<DollarSign size={14} />{" "}
				<span className="capitalize">{how_you_want_to_use}</span>{" "}
				<ChevronDown size={16} />
			</div>
		</div>
	);
}

function BalanceBoard({ balance }: { balance?: number }) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-[18.66px]">Total Balance</span>
				<button
					type="button"
					className="flex items-center gap-1 px-2 py-1 border-b rounded-full border-gray-600 font-light text-[9.42px]"
				>
					This Week
					<ChevronDown size={12} />
				</button>
			</div>

			<div className="flex items-center gap-12 flex-wrap">
				<div className="text-[34.67px] font-medium">
					₦{balance?.toFixed(2).toLocaleString()}
				</div>
				<div className="flex gap-6 text-sm flex-wrap font-medium">
					<Link
						to="/fund-wallet"
						className="flex items-center gap-2 px-[18.5px] py-[14px] text-white bg-primary rounded-full hover:bg-primary/80 transition-colors"
					>
						<Wallet size={16} /> Fund
					</Link>
					<Link
						to="/withdraw"
						className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-full transition-colors hover:bg-primary/10"
					>
						<Wallet size={16} /> Withdraw
					</Link>
				</div>
			</div>

			<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-[#DAE2FF] p-8 rounded-2xl">
				<div className="space-y-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-[13.87px]">Earned</span>
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-1 border-b rounded-full border-gray-600 font-light text-[9.42px]"
						>
							This Week
							<ChevronDown size={12} />
						</button>
					</div>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Pending</p>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Spent</p>
					<p className="text-[20.8px] font-medium">
						₦ {balance?.toFixed(2).toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}

function WelcomeMessage(props: AuthUserDTO) {
	const dispatch = useDispatch();

	// If the user has not yet been verified,
	// and they click on the `Verify Account` button,
	// this effect checks their verification status on intervals
	// auto-updates it. Useful to save client the need to refresh.
	useEffect(() => {
		const interval = setInterval(() => {
			if (!props.email_verified_at) autoVerifyAccountActivation(dispatch);
			else clearInterval(interval);
		}, 3000);

		return () => clearInterval(interval);
	}, [dispatch, props]);

	return props.email_verified_at ? (
		<div className="text-center">
			<h2 className="text-[31.03px] text-success">You are now a MEMBER</h2>
			<p className="text-[13.87px]">
				Your membership has been successfully activated. Start earning daily by
				posting adverts and completing tasks on your social media accounts.
			</p>
		</div>
	) : (
		<div className="text-center text-[13.87px]">
			<h2 className="text-[20.8px]">Welcome To The Website</h2>
			<p>
				Earn by completing simple social media tasks or advertise your products
				to the right audience.
			</p>
			<button
				type="button"
				onClick={async () => requestVerificationEmail(props.email)}
				className="text-danger underline mx-auto"
			>
				Kindly Verify Your Account
			</button>
			<p className="mt-4">
				Get access to all the services with just ₦1,000{" "}
				<span className="font-medium">ONLY</span> verify your account now!
			</p>
		</div>
	);
}

function PopularProducts() {
	const { products, reload } = useProducts();
	const productsContainer = useRef<HTMLDivElement>(null);
	const { isDragging } = useDraggable(productsContainer);

	return (
		<div className="space-y-3">
			<h2 className="text-[20.8px]">Popular Products</h2>

			{!products && <Loading />}

			{/* No products to show */}
			{products && !products.length && (
				<EmptyMapErr
					description="No products are available yet"
					buttonInnerText="Reload Products"
					onButtonClick={reload}
				/>
			)}

			{products?.length && (
				<div
					ref={productsContainer}
					className={cn(
						"flex gap-4 overflow-x-auto bg-primary/30 p-4 rounded-3xl w-full",
						{
							"cursor-grabbing": isDragging,
							"cursor-grab": !isDragging,
						},
					)}
				>
					{products.map((product) => (
						<ProductCard
							{...product}
							key={product.name}
							version="bordered"
							buttonText="Check Product"
						/>
					))}
				</div>
			)}
		</div>
	);
}

function AdBanner() {
	return (
		<div className="relative">
			<img src="/images/buy-sell-bg.png" alt="" />
			<p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-medium text-white text-center">
				Buy & Sell With Ease
			</p>
		</div>
	);
}
