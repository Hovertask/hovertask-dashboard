import { Mail, Phone, Copy, MessageSquare, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../../../types";
import { Link } from "react-router";

export default function UserProfileCard() {
	const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);

	return (
		<div className="text-gray-800  max-mobile:hidden mt-40">
			<h2 className="text-sm font-medium mb-3">My Profile</h2>

			<div className="bg-white rounded-xl shadow p-4 text-sm">
				<div className="flex items-center">
					<img
						src={authUser.avatar || "/images/default-user.png"}
						alt="Profile"
						className="rounded-full"
						width={40}
					/>
					<div>
						<h3 className="font-medium">
							{authUser.fname} {authUser.lname}
						</h3>
						<p className="text-sm text-gray-500">@{authUser.username}</p>
					</div>
				</div>

				<div className="flex text-green-500 my-1">
					<div className="w-1 h-1 bg-green-500 rounded-full mr-1" />
					<span className="text-xs">online</span>
				</div>

				<div className="mt-1 mb-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
					<CheckCircle className="w-4 h-4" />
					Verified ID
				</div>

				<p className="text-sm text-gray-600 mb-3">6 Followers - 1 Following</p>

				<button
					type="button"
					className="border border-blue-500 text-blue-500 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-blue-50 transition mx-auto mt-16"
				>
					<MessageSquare className="w-4 h-4" />
					Start Chat
				</button>
			</div>

			<div className="mt-12 space-y-2 text-sm text-gray-700">
				<div className="flex items-center gap-2">
					<Mail className="w-4 h-4 text-gray-500" />
					<span>{authUser.email}</span>
				</div>
				<div className="flex items-center gap-2">
					<Phone className="w-4 h-4 text-gray-500" />
					<span>+2347069731575</span>
				</div>
				<div className="flex items-center gap-2">
					<a
						href="https://referral.com/alayandenurudeen"
						className="text-primary underline break-all text-sx px-2 p-1 rounded-full bg-primary/20 line-clamp-1"
					>
						https://referral.com/alayandenurudeen
					</a>
					<Copy className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-800" />
				</div>
			</div>

			<div className="mt-8 flex justify-around text-blue-600 text-lg px-4">
				<Link to="#">
					<img width={20} src="/images/devicon_facebook.png" alt="" />
				</Link>
				<Link to="#">
					<img width={20} src="/images/logos_whatsapp-icon.png" alt="" />
				</Link>
				<Link to="#">
					<img width={20} src="/images/logos_tiktok-icon.png" alt="" />
				</Link>
				<Link to="#">
					<img width={20} src="/images/skill-icons_instagram.png" alt="" />
				</Link>
			</div>
		</div>
	);
}
