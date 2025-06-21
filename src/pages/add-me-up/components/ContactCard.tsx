import { Gift } from "lucide-react";
import type { ContactCardProps } from "../../../../types";
import cn from "../../../utils/cn";

export default function ContactCard(props: ContactCardProps) {
	return (
		<div
			className={cn(
				"flex flex-col bg-white rounded-2xl p-4 space-y-2 justify-between",
				{
					"flex-row items-center w-[320px]": props.horizontal,
					"w-[180px] min-w-[180px]": !props.horizontal && !props.responsive,
				},
			)}
		>
			<div className="rounded-2xl overflow-hidden w-fit mx-auto">
				<img
					className="aspect-[4/3] block w-24"
					width={60}
					src={props.image_url}
					alt=""
				/>
			</div>
			<div>
				<p className="font-medium line-clamp-1">{props.name}</p>
				<p className="text-zinc-600">Connect in seconds</p>
			</div>

			<div className="flex items-center gap-2 text-sm">
				<p className="flex items-center gap-1">
					<Gift size={16} /> {props.points_required}p
				</p>
				<button
					type="button"
					onClick={props.onButtonClickAction}
					className="p-2 text-xs rounded-xl transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white"
				>
					{props.isGroup ? "Join Group" : "Add Contact"}
				</button>
			</div>
		</div>
	);
}
