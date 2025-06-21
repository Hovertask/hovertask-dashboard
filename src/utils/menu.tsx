import {
	CheckCircle,
	LayoutDashboard,
	List,
	ListCheck,
	LogOut,
	Store,
	Target,
	UserPlus,
	Wallet,
} from "lucide-react";

export default [
	{
		path: "/",
		label: "Dashboard",
		icon: <LayoutDashboard size={13} />,
	},
	{
		path: "/earn",
		label: "Earn",
		icon: <Wallet size={13} />,
	},
	{
		path: "/advertise",
		label: "Advertise",
		icon: <CheckCircle size={13} />,
	},
	{
		basePath: "/marketplace",
		label: "Marketplace",
		icon: <Store size={13} />,
		options: [
			{
				path: "/marketplace/list-product",
				label: "List a New Product",
				icon: <List size={13} />,
			},
			{
				path: "/marketplace/listings",
				label: "View Product Listings",
				icon: <ListCheck size={13} />,
			},
			{
				path: "/marketplace/performance",
				label: "Track Performance",
				icon: <Target size={13} />,
			},
		],
	},
	{
		basePath: "/buy-followers",
		label: "Buy Followers",
		icon: <UserPlus size={13} />,
		options: [
			{
				path: "/buy-followers",
				label: "Buy Followers",
				icon: <UserPlus size={13} />,
			},
			{
				path: "/add-me-up",
				label: "Add Me Up",
				icon: <UserPlus size={13} />,
			},
		],
	},
	{
		path: "/add-me-up",
		label: "Add Me Up",
		icon: <UserPlus size={13} />,
	},
	{
		path: "/refer-and-earn",
		label: "Refer and Earn",
		icon: (
			<span style={{ fontSize: 13 }} className="material-icons-outlined">
				share
			</span>
		),
	},
	{
		path: "/support-and-faq",
		label: "Support and FAQ",
		icon: (
			<span style={{ fontSize: 13 }} className="material-icons-outlined">
				support_agent
			</span>
		),
	},
	{
		path: "/logout",
		label: "Logout",
		icon: <LogOut size={13} />,
	},
];
