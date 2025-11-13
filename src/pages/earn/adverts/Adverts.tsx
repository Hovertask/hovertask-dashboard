import { Check, Hexagon, Megaphone } from "lucide-react";
import { Link } from "react-router";
import LinkAccountsModal from "../components/LinkAccountsModal";
import Banner from "./components/Banner";
import AdvertTAb from "./components/components/AdvertTab";
import { useSelector } from "react-redux";

export default function Adverts() {
	const hasNewlyLinkedAccount = new URLSearchParams(window.location.search).has(
		"newlyLinkedAccounts",
	);
	// TODO: Update this
	const isAccountLinked = useSelector(
		(state: any) => state.auth.value.is_account_linked,
	);


	return (
		<>
			<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
				<div className="bg-white shadow p-4 pt-10 space-y-12 min-h-full">
					<Banner />

					<div className="space-y-6">
						<div className="p-6 shadow bg-white rounded-3xl space-y-3">
							<div className="w-fit mx-auto flex items-center gap-4 p-4 bg-primary rounded-3xl border-b border-b-black overflow-x-auto font-medium">
								<Link
									to="/earn/tasks"
									className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all"
								>
									<Hexagon size={14} /> Perform Tasks
								</Link>
								<button
									type="button"
									className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl whitespace-nowrap text-sm active:scale-95 transition-all bg-white text-primary"
								>
									<Megaphone size={14} /> Post Adverts to Earn Money
								</button>
							</div>

							<p className="text-center text-xs text-secondary">
								Get paid to post adverts for businesses and top brands. Share
								with your followers and earn effortlessly.
							</p>
						</div>
					</div>

					{hasNewlyLinkedAccount && (
						<div className="flex flex-col items-center text-center">
							<Check strokeWidth={2} size={50} className="text-success" />
							<h3 className="text-[27.21px]">Account Linked Successfully</h3>
						</div>
					)}

					{!isAccountLinked && (
						<div className="p-6 shadow bg-white rounded-3xl space-y-5 text-center">
							<h3 className="text-2xl">Link Your Social Media Accounts</h3>
							<p className="text-xs font-light text-secondary max-w-[494px] mx-auto">
								You need to link your Facebook account to website before you can
								start earning with your social media account. Click the button
								below to link your account now.
							</p>
							<Link
								className="border-primary border rounded-xl text-xs font-medium text-primary text-center whitespace-nowrap h-fit p-3 -rotate-[4deg] transition-all hover:rotate-0 hover:bg-primary/10 max-sm:flex-1 block w-fit mx-auto"
								to="/earn/connect-accounts"
							>
								Link Your Account
							</Link>
						</div>
					)}

					<hr className="max-w-md mx-auto" />

					<div className="text-[13.34px] space-y-3">
						<h3 className="text-primary border-b border-b-primary font-medium px-4 py-1 rounded-full w-fit">
							Are You Eligible?
						</h3>

						<ul className="list-disc ml-4 font-light">
							<li>
								Minimum of 1,000 followers on your Facebook, Instagram, Twitter
								or TikTok accounts.
							</li>
							<li>Active and engaging account with regular posts.</li>
						</ul>
					</div>

					<AdvertTAb />
				</div>
			</div>

			<LinkAccountsModal />
		</>
	);
}
