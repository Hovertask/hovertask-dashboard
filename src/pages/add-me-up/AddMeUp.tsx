import { ArrowLeft, Gift } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import type { AuthUserDTO, ContactCardProps } from "../../../types";
import AddMeUpAside from "../../shared/components/AddMeUpAside";
import CarouselAdBanner from "../../shared/components/CarouselAdBanner";
import ContactGainModal from "../dashboard/components/ContactGainModal";
import ContactsSection from "./components/ContactSection";
import HorizontalLine from "./components/HorizontalLine";

export const contacts: ContactCardProps[] = [
	{
		id: "1",
		name: "Alice Thompson",
		image_url: "https://randomuser.me/api/portraits/women/1.jpg",
		points_required: 150,
		contact_url: "https://example.com/contact/alice",
	},
	{
		id: "2",
		name: "Brandon Lee",
		image_url: "https://randomuser.me/api/portraits/men/2.jpg",
		points_required: 200,
		contact_url: "https://example.com/contact/brandon",
	},
	{
		id: "3",
		name: "Carla Mendes",
		image_url: "https://randomuser.me/api/portraits/women/3.jpg",
		points_required: 175,
		contact_url: "https://example.com/contact/carla",
	},
	{
		id: "4",
		name: "Daniel Chen",
		image_url: "https://randomuser.me/api/portraits/men/4.jpg",
		points_required: 220,
		contact_url: "https://example.com/contact/daniel",
	},
	{
		id: "5",
		name: "Ella Johnson",
		image_url: "https://randomuser.me/api/portraits/women/5.jpg",
		points_required: 190,
		contact_url: "https://example.com/contact/ella",
	},
	{
		id: "6",
		name: "Felix Carter",
		image_url: "https://randomuser.me/api/portraits/men/6.jpg",
		points_required: 160,
		contact_url: "https://example.com/contact/felix",
	},
	{
		id: "7",
		name: "Grace Li",
		image_url: "https://randomuser.me/api/portraits/women/7.jpg",
		points_required: 210,
		contact_url: "https://example.com/contact/grace",
	},
	{
		id: "8",
		name: "Henry Brooks",
		image_url: "https://randomuser.me/api/portraits/men/8.jpg",
		points_required: 180,
		contact_url: "https://example.com/contact/henry",
	},
	{
		id: "9",
		name: "Isabelle Cruz",
		image_url: "https://randomuser.me/api/portraits/women/9.jpg",
		points_required: 230,
		contact_url: "https://example.com/contact/isabelle",
	},
	{
		id: "10",
		name: "Jason Patel",
		image_url: "https://randomuser.me/api/portraits/men/10.jpg",
		points_required: 170,
		contact_url: "https://example.com/contact/jason",
	},
];

export default function AddMeUp() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-8 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">
							Expand Your Network With a Single Click
						</h1>
						<p className="text-sm text-zinc-500">
							Easily add contacts through WhatsApp, complete tasks and grow your
							network effortlessly
						</p>
					</div>
				</div>

				<div>
					<img src="/images/Rectangle 39328.png" alt="" />
				</div>

				<UserInfoSection />
				<PointsInformation />
				<ContactsSection
					onClickAction={() => toast.success("User added successfully!")}
					contacts={contacts}
					heading="New Contacts Added"
					link="/add-me-up/add-contacts"
				/>
				<ContactsSection
					onClickAction={() => toast.success("Group joined successfully!")}
					contacts={contacts}
					isGroup
					heading="New Groups Added"
					link="/add-me-up/add-contacts"
				/>
				<CarouselAdBanner />
			</div>

			<AddMeUpAside />
		</div>
	);
}

function UserInfoSection() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<div className="flex gap-4 justify-between flex-wrap">
			<div className="flex items-center gap-2">
				<img
					width={40}
					src={authUser.avatar || "/images/default-user.png"}
					alt=""
				/>
				<div>
					<p className="text-lg font-medium">
						Hi, {authUser.fname} {authUser.lname}
					</p>
					<Link
						to="/add-me-up/profile"
						className="text-sm hover:underline text-primary"
					>
						View Profile
					</Link>
				</div>
			</div>

			<div className="flex gap-2 items-center">
				<Link
					className="py-2 px-4 text-sm rounded-xl transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white"
					to="/add-me-up/list-profile-form"
				>
					List Contact
				</Link>
				<Link
					className="py-2 px-4 text-sm rounded-xl transition-all hover:bg-primary/10 active:scale-95 border border-primary text-primary"
					to="/add-me-up/list-profile-form"
				>
					List Group
				</Link>
			</div>
		</div>
	);
}

function PointsInformation() {
	return (
		<>
			<div className="space-y-4 px-8 py-4 max-sm:px-4 bg-white shadow-md rounded-2xl">
				<div className="flex justify-between items-center flex-wrap">
					<p className="inline-flex items-center gap-2">
						Your points:{" "}
						<span>
							<span className="text-2xl font-medium inline-flex items-center gap-2">
								<Gift /> 120
							</span>{" "}
							<span className="text-sm font-medium">Points</span>
						</span>
					</p>

					<Link
						className="p-2 text-xs rounded-xl transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white"
						to="/add-me-up/points"
					>
						Get More Points
					</Link>
				</div>

				<div className="flex gap-2 justify-around bg-primary/10 p-4 rounded-2xl">
					<div className="text-sm">
						<p className="text-zinc-700">Contacts Added</p>
						<p className="text-xl font-medium">1,000</p>
					</div>

					<HorizontalLine />

					<div className="text-sm">
						<p className="text-zinc-700">Groups Joined</p>
						<p className="text-xl font-medium">50</p>
					</div>

					<HorizontalLine />

					<div className="text-sm">
						<p className="text-zinc-700 flex items-end gap-2">
							Contacts Listed{" "}
							<span>
								<span className="text-xl font-medium">10</span> Active
							</span>{" "}
							<span>
								<span className="text-xl font-medium">0</span> Inactive
							</span>
						</p>
						<Link
							to="/add-me-up/list-profile"
							className="text-primary hover:underline"
						>
							View
						</Link>
					</div>
				</div>
			</div>

			<ContactGainModal />
		</>
	);
}
