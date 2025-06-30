import { Bookmark, Heart, Star } from "lucide-react";
import { useState } from "react";
import cn from "../../utils/cn";
import Feedback from "../../shared/components/Feedback";
// import SellerInfoAside from "../../components/SellerInfoAside";

export default function SellerPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-8 overflow-hidden">
				<div className="bg-[#EEF0FF]">
					<div className="bg-gradient-to-b from-[#F4F4FA] to-white rounded-b-lg p-4 rounded-[15.2px] space-y-4">
						<div className="flex gap-2 items-center">
							<img
								width={42}
								height={42}
								src="/assets/images/demo-avatar.png"
								alt="Avatar"
							/>
							<div className="flex gap-x-12 gap-y-4 flex-wrap">
								<div className="text-secondary">
									<p className="text-xl">Alayande Bamidele</p>
									<p className="text-secondary">@Datalite Gadgets</p>
								</div>
								<div className="flex gap-2 h-fit text-[#77777A]">
									<button className="p-1 rounded-full border border--[#77777A]">
										<Heart size={18} />
									</button>
									<button className="p-1 rounded-full border border--[#77777A]">
										<Bookmark size={18} />
									</button>
								</div>
							</div>
						</div>
						<div className="flex justify-around items-end flex-wrap whitespace-nowrap gap-x-4 gap-y-2">
							<div className="space-y-3">
								<div className="flex gap-4 items-center">
									<img
										src="/assets/images/twemoji_flag-nigeria.png"
										width={20}
										alt="Flag"
									/>{" "}
									|{" "}
									<span className="relative text-[#77777A] text-[9.82px]">
										Online{" "}
										<span className="absolute -left-1.5 top-1 h-1 w-1 bg-green-400 rounded-full"></span>
									</span>
								</div>
								<div className="flex justify-between gap-4">
									<div className="text-[#00B306] bg-[#00B3061A] text-[10.66px] px-[12.8px] py-[3.2px] rounded-full text-center">
										Verified ID
									</div>
									<div className="text-[8.24px] flex items-center gap-1">
										<Star size={14} color="#F5B300" /> 4.8
									</div>
									<button className="text-white bg-primary text-[10.66px] px-[12.8px] py-[3.2px] rounded-full text-center">
										Follow
									</button>
								</div>
							</div>
							<div className="flex gap-2">
								<div className="bg-[#EEF0FF] w-[60.61px] h-[37.04px] px-2 py-0.5 rounded-lg flex flex-col gap-0.5 border-1 border-[#66666666] flex-1">
									<span className="text-[10.58px]">3</span>
									<span className="text-[8.98px]">Referrals</span>
								</div>
								<div className="bg-[#EEF0FF] w-[60.61px] h-[37.04px] px-2 py-0.5 rounded-lg flex flex-col gap-0.5 border-1 border-[#66666666] flex-1">
									<span className="text-[10.58px]">6</span>
									<span className="text-[8.98px]">Followers</span>
								</div>
								<div className="bg-[#EEF0FF] w-[60.61px] h-[37.04px] px-2 py-0.5 rounded-lg flex flex-col gap-0.5 border-1 border-[#66666666] flex-1">
									<span className="text-[10.58px]">1</span>
									<span className="text-[8.98px]">Following</span>
								</div>
							</div>
							<div className="flex gap-2 flex-wrap justify-center items-center">
								<button className="active:scale-90 transition-transform text-[8.89px] px-[17.06px] py-[10.67px] w-fit bg-primary rounded-[20.01px] text-white">
									Contact Seller
								</button>
								<button className="active:scale-90 transition-transform text-[8.89px] px-[17.06px] py-[10.67px] w-fit border-primary border-1 rounded-[20.01px] text-primary">
									Start Chat
								</button>
							</div>
						</div>
					</div>
					<p className="text-xs text-center p-4">
						Municipal Area Council, Federal Capital Territory, Nigeria
					</p>
				</div>

				<SellingReviewsFollowersTab />
			</div>

			<div>{/* <SellerInfoAside {...seller} /> */}</div>
		</div>
	);
}

function SellingReviewsFollowersTab() {
	const [currentTab, setCurrentTab] = useState<
		"selling" | "reviews" | "followers"
	>("selling");

	return (
		<div className="space-y-4">
			<div className="flex max-w-lg mx-auto items-center gap-2">
				<button
					className={cn(
						"px-2 py-1.5 rounded-lg flex-1 active:scale-95 transition-all",
						{
							"bg-primary text-white": currentTab === "selling",
						},
					)}
					onClick={() => setCurrentTab("selling")}
				>
					Selling (1)
				</button>
				<button
					className={cn(
						"px-2 py-1.5 rounded-lg flex-1 active:scale-95 transition-all",
						{
							"bg-primary text-white": currentTab === "reviews",
						},
					)}
					onClick={() => setCurrentTab("reviews")}
				>
					Reviews (2)
				</button>
				<button
					className={cn(
						"px-2 py-1.5 rounded-lg flex-1 active:scale-95 transition-all",
						{
							"bg-primary text-white": currentTab === "followers",
						},
					)}
					onClick={() => setCurrentTab("followers")}
				>
					Followers (3)
				</button>
			</div>

			<hr className="border-primary" />

			{currentTab === "selling" && <SellingTab />}
			{currentTab === "reviews" && <ReviewsTab />}
			{currentTab === "followers" && <FollowersTab />}
		</div>
	);
}

function SellingTab() {
	return (
		<div className="flex flex-col gap-1 items-center justify-center text-center">
			<img src="/images/iconoir_info-empty.png" width={60} alt="" />
			<p>This user does not have any products yet</p>
			<button
				onClick={() => window.location.reload()}
				className="bg-primary text-white px-4 py-2 text-sm rounded-lg transition-transform active:scale-95"
			>
				Try Again
			</button>
		</div>
	);
}

function ReviewsTab() {
	return (
		<div className="space-y-4">
			<h2 className="font-medium">Customer Feedback</h2>
			<div className="space-y-6">
				<Feedback
					name="Onah Victor"
					rating={3}
					comment="Amazing sound quality and super comfortable to wear! The battery life is a game-changer."
					date="Dec.29,2024"
				/>
				<Feedback
					name="Onah Victor"
					rating={5}
					comment="Amazing sound quality and super comfortable to wear! The battery life is a game-changer."
					date="Dec.29,2024"
				/>
			</div>
		</div>
	);
}

function FollowersTab() {
	return (
		<div className="space-y-2">
			<Follower />
			<Follower />
			<Follower />
			<Follower />
			<Follower />
		</div>
	);
}

function Follower() {
	return (
		<div className="flex gap-2 items-center">
			<img width={28.089} src="/assets/images/demo-avatar.png" alt="" />
			<div>
				<p className="text-[14.04px]">Onah Victor</p>
				<div className="flex items-center gap-2">
					<img width={14.04} src="/images/nigerian-flag.png" alt="Flag" /> |{" "}
					<span className="text-[#77777A] text-[10.53px]">Dec 23, 2025</span>
				</div>
			</div>
		</div>
	);
}
