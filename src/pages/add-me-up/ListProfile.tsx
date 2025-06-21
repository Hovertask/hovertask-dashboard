import { ArrowLeft } from "lucide-react";
import { Link, type NavigateFunction, useNavigate } from "react-router";
import cn from "../../utils/cn";
import { useState } from "react";
import EmptyMapErr from "../_shared/components/EmptyMapErr";
import AddMeUpAside from "../_shared/components/AddMeUpAside";

export default function ListProfile() {
	const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
	const navigate = useNavigate();

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/add-me-up">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">List Profile</h1>
						<p className="text-sm text-zinc-500">Manage Your Account</p>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-center overflow-auto max-w-full border-b border-b-primary pb-2">
						<button
							type="button"
							onClick={() => setActiveTab("active")}
							className={cn(
								"py-3 px-16 text-sm rounded-xl transition-all active:scale-95 bg-primary text-white",
								{
									"bg-white text-primary": activeTab === "inactive",
								},
							)}
						>
							Active Listing Contact
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("inactive")}
							className={cn(
								"py-3 px-16 text-sm rounded-xl transition-all active:scale-95 bg-primary text-white",
								{
									"bg-white text-primary": activeTab === "active",
								},
							)}
						>
							Inactive Listing Contact
						</button>
					</div>

					{activeTab === "active" ? (
						<ActiveContactListing navigate={navigate} />
					) : (
						<InactiveContactListing navigate={navigate} />
					)}
				</div>
			</div>

			<AddMeUpAside />
		</div>
	);
}

function ActiveContactListing(props: { navigate: NavigateFunction }) {
	return (
		<div className="py-16">
			<EmptyMapErr
				onButtonClick={() => props.navigate("/add-me-up/list-profile-form")}
				description={
					<div className="text-sm space-y-2">
						<p className="font-medium">You don't have any active listings</p>
						<p>
							Want to get more views and addups? List your profile and start
							getting friends! <br /> Every time someone adds you, points will
							be deducted
						</p>
					</div>
				}
				buttonInnerText="List My Profile"
			/>
		</div>
	);
}

function InactiveContactListing(props: { navigate: NavigateFunction }) {
	return (
		<div className="py-16">
			<EmptyMapErr
				onButtonClick={() => props.navigate("/add-me-up/list-profile-form")}
				description={
					<div className="text-sm space-y-2">
						<p className="font-medium">You don't have any inactive listings</p>
						<p>
							Want to get more views and addups? List your profile and start
							getting friends! <br /> Every time someone adds you, points will
							be deducted
						</p>
					</div>
				}
				buttonInnerText="List My Profile"
			/>
		</div>
	);
}
