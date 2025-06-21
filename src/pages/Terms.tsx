import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import UserProfileCard from "../components/UserProfileCard";

const sections = [
	{
		title: "1. General Conditions",
		items: [
			"The platform provides a marketplace for users to buy, sell, or advertise products and services.",
			"By using this platform, you agree to comply with all applicable laws and regulations.",
			"The platform reserves the right to modify or discontinue any part of the services at any time without prior notice.",
		],
	},
	{
		title: "2. Account Registration and Usage",
		items: [
			"Users must register for an account to access certain features of the platform.",
			"You are required to provide accurate personal information during registration.",
			"You are solely responsible for maintaining the confidentiality of your account details.",
			"Impersonation, creating fake accounts, or providing false information is strictly prohibited.",
		],
	},
	{
		title: "3. Prohibited Activities",
		items: [
			"Users must not engage in activities that violate laws or compromise the integrity of the platform.",
			"Examples of prohibited activities include:",
		],
		extra: [
			"• Posting fraudulent or misleading advertisements.",
			"• Spamming or phishing other users.",
			"• Uploading harmful content such as viruses or malware.",
		],
	},
	{
		title: "4. Marketplace Rules",
		items: [
			"Sellers must provide accurate descriptions and images of their products or services.",
			"Buyers must make payments promptly and in full for all purchases.",
			"Disputes between buyers and sellers should be reported to the platform's support team.",
			"The platform is not liable for transactions conducted outside its system.",
		],
	},
	{
		title: "5. Payment and Transactions",
		items: [
			"All payments are processed through secure payment gateways provided on the platform.",
			"Accepted payment methods include wallet balance, bank transfers, and online card payments.",
			"Refunds and cancellations will follow the platform’s refund policy, which may vary depending on the product or service purchased.",
		],
	},
	{
		title: "6. User Responsibilities",
		items: [
			"Users must ensure the fair and legal use of the platform.",
			"Users are prohibited from using the platform for illegal, harmful, or unauthorized purposes.",
			"Users must respect the intellectual property and privacy rights of others.",
		],
	},
	{
		title: "7. Limitation of Liability",
		items: [
			"The platform does not guarantee the quality, accuracy, or reliability of products or services listed by users.",
			"The platform is not responsible for any loss, damage, or dispute arising from user interactions or transactions.",
			"Users are encouraged to exercise caution and conduct their own due diligence before engaging in transactions.",
		],
	},
	{
		title: "8. Termination of Use",
		items: [
			"The platform reserves the right to suspend or terminate user accounts that violate these terms.",
			"Users may request account deletion by contacting the support team.",
			"Termination of an account will not exempt users from any liabilities or obligations incurred before the termination date.",
		],
	},
	{
		title: "9. Changes to Terms of Use",
		items: [
			"The platform reserves the right to update or modify these terms at any time.",
			"Significant changes will be communicated to users via email or notifications on the platform.",
		],
	},
];

export default function TermsPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-5 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<h1 className="text-xl font-medium">Terms</h1>
				</div>

				<h2 className="text-lg font-medium mb-2">Welcome to Our Platform</h2>
				<p className="text-sm text-gray-600">
					By accessing and using our platform, you agree to these Terms of Use.
					These terms govern your rights and responsibilities while using our
					marketplace for buying, selling, advertising, and engaging in tasks.
					Please read them carefully. If you do not agree with these terms,
					kindly refrain from using our services.
				</p>

				{sections.map((section, idx) => (
					<div key={idx}>
						<h2 className="text-primary text-sm">{section.title}</h2>
						<ul className="mt-1 space-y-1">
							{section.items.map((item, i) => (
								<li key={i} className="text-sm text-gray-700">
									{idx + 1}.{i + 1}. {item}
								</li>
							))}
							{section.extra?.map((item, i) => (
								<li key={i} className="text-sm text-gray-700 ml-4">
									{item}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}
