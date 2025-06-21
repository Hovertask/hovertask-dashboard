import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router";

const ChatMessage = ({
	isUser,
	message,
	time,
}: { isUser: boolean; message: string; time: string }) => (
	<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
		{!isUser && <User />}
		<div
			className={`max-w-sm px-4 py-2 rounded-xl text-sm ${
				isUser
					? "bg-primary text-white rounded-br-none"
					: "bg-gray-100 text-gray-800 rounded-bl-none"
			}`}
		>
			{message}
			<div className="text-[10px] text-gray-400 mt-1 text-right">{time}</div>
		</div>
		{isUser && <User />}
	</div>
);

export default function SellerChat() {
	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-8 overflow-hidden">
				<div className="flex gap-4 flex-1">
					<Link to="/marketplace">
						<ArrowLeft />
					</Link>

					<h1 className="text-xl font-medium">Contact Seller</h1>
				</div>

				<div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<img
								src="/shirt.jpg"
								alt="Shirt"
								className="w-12 h-12 rounded-md"
							/>
							<div>
								<p className="text-sm font-medium">
									Blue-color Roundneck - High Quality
								</p>
								<p className="text-xs text-gray-500">#9,842.22</p>
							</div>
						</div>
						<button type="button" className="text-xs text-blue-600 underline">
							View product
						</button>
					</div>
					<div className="bg-red-50 text-red-500 text-xs p-2 rounded mb-2">
						Request to return or replace product has been rejected by the seller
					</div>
					<div className="bg-red-100 text-red-600 text-xs p-2 rounded">
						Reason: Please message the seller for clarification and resolution
					</div>
				</div>

				<div className="space-y-4">
					<ChatMessage
						isUser={true}
						message="Hi, the item I got was not as described"
						time="9:03 AM"
					/>
					<ChatMessage
						isUser={false}
						message="Hey, I can help. Which color or which 'Physical defect' is the problem?"
						time="9:04 AM"
					/>
					<ChatMessage
						isUser={true}
						message="The color was totally off. I ordered navy blue"
						time="9:05 AM"
					/>
					<ChatMessage
						isUser={false}
						message="Totally understood, boss. I think it's green and grey in low-light. I'll process a free return."
						time="9:07 AM"
					/>
					<ChatMessage isUser={true} message="Oh okay" time="9:07 AM" />
					<ChatMessage
						isUser={true}
						message="Could it be blue-light on your product photos?"
						time="9:08 AM"
					/>
					<ChatMessage
						isUser={false}
						message="Legit... my camera has bad tinting and no support during the last shoot."
						time="9:09 AM"
					/>
					<ChatMessage
						isUser={true}
						message="Ok, I understand"
						time="9:09 AM"
					/>
				</div>
			</div>
		</div>
	);
}
