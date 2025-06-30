import {
	ArrowLeft,
	Settings,
	ShoppingCart,
	HandCoins,
	ClipboardList,
	Truck,
} from "lucide-react";
import { Link } from "react-router";
import UserProfileCard from "../shared/components/UserProfileCard";

export default function NotificationsPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-5 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">
							Stay Updated On Your Activities
						</h1>
						<p className="text-sm text-zinc-500">
							Never miss a thing! Get real-time updates on your activities and
							stay in the loop effortlessly.
						</p>
					</div>
				</div>

				<div className="border-b-2 border-b-primary max-w-lg mx-auto pb-2">
					<div className="flex max-w-full justify-around items-center mx-auto gap-6 overflow-x-auto">
						<button className="bg-primary p-2 rounded-lg text-white transition-transform active:scale-95 disabled:opacity-50 text-sm">
							🔔 General Alerts
						</button>
						<Link
							className="p-2 transition-transform active:scale-95 disabled:opacity-50 text-sm"
							to="/advertise/engagement-tasks"
						>
							💵 Earnings
						</Link>
						<Link
							className="p-2 transition-transform active:scale-95 disabled:opacity-50 text-sm"
							to="/"
						>
							🛍️ Shopping
						</Link>
					</div>
				</div>

				<div className="flex justify-end">
					<button className="flex items-center gap-2 text-primary hover:bg-primary/20 transition-transform active:scale-95 disabled:opacity-50 text-sm p-2 rounded-full">
						<Settings size={16} /> Settings
					</button>
				</div>

				<Notifications />

				<button className="text-primary hover:bg-primary/20 transition-transform text-sm p-2 rounded-full active:scale-95">
					See All Notifications
				</button>
			</div>

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}

const notifications = [
	{
		icon: <ShoppingCart className="text-black" />,
		title: "Order Confirmed!",
		message: "Your purchase of 'Wireless Earbuds' for ₦7,500 is confirmed.",
		time: "Yesterday, 2:15 PM",
		read: true,
	},
	{
		icon: <HandCoins className="text-black" />,
		title: "Withdrawal Successful!",
		message: "Your withdrawal of ₦10,000 to FCMB has been processed.",
		time: "5 minutes ago",
		read: false,
		bg: "bg-blue-50",
	},
	{
		icon: <ClipboardList className="text-black" />,
		title: "Daily Earnings Update",
		message:
			"You earned ₦3,000 today by completing tasks and reselling products.",
		time: "1 hour ago",
		read: false,
		bg: "bg-green-50",
	},
	{
		icon: <Truck className="text-black" />,
		title: "Order Shipped!",
		message:
			"Your order for 'Smart Fitness Watch' is on its way. Tracking ID: 123456.",
		time: "Today, 9:45 AM",
		read: false,
		bg: "bg-pink-50",
	},
];

function Notifications() {
	return (
		<div>
			{notifications.map((item, idx) => (
				<div
					key={idx}
					className={`flex items-center p-4 gap-4 ${item.bg || "bg-primary/5"}`}
				>
					<div>{item.icon}</div>
					<div className="flex-1">
						<h4 className="font-medium">{item.title}</h4>
						<p className="text-sm text-gray-700">{item.message}</p>
					</div>
					<div className="text-right flex flex-col self-stretch justify-between">
						<p className="text-sm text-gray-500">
							{item.read ? "Read" : "Unread"}
						</p>
						<p className="text-xs text-gray-400">{item.time}</p>
					</div>
				</div>
			))}
		</div>
	);
}
