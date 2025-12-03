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
	BarChart2
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp,} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";


export default [
	{
		path: "/",
		label: "Dashboard",
		icon: <LayoutDashboard size={13} />,
	},
	{
		basePath: "/earn",
		label: "Earn",
		icon: <Wallet size={13} />,
		options: [
			{
				path: "/earn/adverts",
				label: "Post Adverts To Earn ",
				icon: <List size={13} />,
			},
			{
				path: "/earn/tasks",
				label: " Complete Tasks To Earn",
				icon: <List size={13} />,
			},
			{
				path: "/earn/resell",
				label: "Earn by Reselling ",
				icon: <List size={13} />,
			},
            {
				path: "/earn/tasks-history",
				label: "Completed Tasks History ",
				icon: <List size={13} />,
			},

		],	
	},
	{
		basePath: "/advertise",
		label: "Advertise",
		icon: <CheckCircle size={13} />,
		options: [
  {
    path: "/advertise/post-advert?platform=WhatsApp",
    label: "Get Your Advert Posted On WhatsApp",
    icon: <FaWhatsapp size={13} />,
  },
  {
    path: "/advertise/post-advert?platform=Facebook",
    label: "Get Your Advert Posted On Facebook",
    icon: <FaFacebook size={13} />,
  },
  {
    path: "/advertise/post-advert?platform=Instagram",
    label: "Get Your Advert Posted On Instagram",
    icon: <FaInstagram size={13} />,
  },
  {
    path: "/advertise/post-advert?platform=X",
    label: "Get Your Advert Posted On X (Twitter)",
    icon: <FaTwitter size={13} />,
  },
  {
    path: "/advertise/post-advert?platform=TikTok",
    label: "Get Your Advert Posted On TikTok",
    icon: <SiTiktok size={13} />,
  },
   {
    path: "/advertise/post-advert?type=engagement&engagementType=Get Real People to Like your Social Media Post",
    label: "Get more Likes on social media",
    icon: <SiTiktok size={13} />,
  },
  {
    path: "/advertise/post-advert?type=engagement&engagementType=Get Real People to Follow you",
    label: "Get more Followers on social media",
    icon: <SiTiktok size={13} />,
  },
  {
    path: "/advertise/post-advert?type=engagement&engagementType=Get Real People to Comment to your Social Media Post",
    label: "Get more Comments on social media",
    icon: <SiTiktok size={13} />,
  },
  {
    path: "/advertise/post-advert?type=engagement&engagementType=Get Real People to Subscribe to your Channel",
    label: "Get more subscribers on social media",
    icon: <SiTiktok size={13} />,
  },
  {
				path: "/advertise/advert-tasks-history",
				label: "Advert Task History ",
				icon: <List size={13} />,
 },
 {
				path: "/advertise/engagement-tasks-history",
				label: "Engagement Task History",
				icon: <List size={13} />,
},

  
],

	},
    {
	    path: "/fund-wallet",
		label: "Wallet",
		icon: <Wallet size={13} />,
    },
	{
		basePath: "/marketplace",
		label: "Marketplace",
		icon: <Store size={13} />,
		options: [
			{
				path: "/marketplace/list-product?type=list-product",
				label: "List a New Product",
				icon: <List size={13} />,
			},
			{
				path: "/marketplace/listings",
				label: "View Product Listings",
				icon: <ListCheck size={13} />,
			},
			{
				path: "/marketplace/list-product?type=resell",
				label: "Add Resell Product",
				comingSoon: true,
				icon: <Target size={13} />,
			},
		],
	},
	{
    path: "/reseller-conversions",
    label: "Reseller Conversions",
    comingSoon: false,
    icon: <BarChart2 size={13} />,
    },
	{
		basePath: "#",
		label: "Buy Followers",
		comingSoon: true,
		icon: <UserPlus size={13} />,
		options: [
			{
				path: "/advertise/post-advert?type=engagement&engagementType=Get Real People to Follow you",
				label: "Buy Followers",
				icon: <UserPlus size={13} />,
			},
			
		],
	},
	{
		path: "/add-me-up",
		label: "Add Me Up",
		comingSoon: true,
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
		comingSoon: true,
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
