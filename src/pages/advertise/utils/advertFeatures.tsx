import {
	Globe,
	MessageCircleIcon,
	ThumbsUpIcon,
	TwitterIcon,
} from "lucide-react";

const advertFeatures = [
	{
		rotateClassName: "rotate-[3deg]",
		index: 1,
		title: "Massive Advert Views",
		description:
			"Get exposure with over 10 million monthly visits, driving faster sales.",
		icon: <Globe />,
	},
	{
		rotateClassName: "rotate-[-3deg]",
		index: 2,
		title: "Social Media Boost",
		description:
			"Reach wider audiences on platforms like Facebook, Instagram, and Twitter.",
		icon: <TwitterIcon />,
	},
	{
		rotateClassName: "rotate-[-3deg]",
		index: 3,
		title: "Direct Buyer Interaction",
		description: "Chat with buyers via in-app messages, WhatsApp, or calls.",
		icon: <MessageCircleIcon />,
	},
	{
		rotateClassName: "rotate-[3deg]",
		index: 4,
		title: "Affordable Costs",
		description:
			"Reach wider audiences on platforms like Facebook, Instagram, and Twitter.",
		icon: <ThumbsUpIcon />,
	},
];

export default advertFeatures;
