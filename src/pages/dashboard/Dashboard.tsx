import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../types";
import AvailableTasks from "../../shared/components/AvailableTasks";
import AvailableJobs from "../earn/adverts/components/AvailableJobs";
import AdBanner from "./components/AdBanner";
import BalanceBoard from "./components/BalanceBoard";
import BecomeMemberModal from "./components/BecomeAMemberModal";
import Carousel from "./components/Carousel";
import Greeting from "./components/Greeting";
import PopularProducts from "./components/PopularProducts";
import WelcomeMessage from "./components/WelcomeMessage";

export default function Dashboard() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<>
			<div className="mobile:grid grid-cols-[1fr_182px] gap-4 min-h-full">
				<div className="px-4 py-10 space-y-12 bg-white shadow min-h-full lg:max-w-[573px] overflow-x-hidden">
					<Greeting
						lname={authUser.lname}
						how_you_want_to_use={authUser.how_you_want_to_use}
					/>
					<BalanceBoard balance={authUser.balance} />
					<WelcomeMessage {...authUser} />
					<AvailableJobs mode="preview" />
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
		</>
	);
}
