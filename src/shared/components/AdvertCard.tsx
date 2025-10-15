import { CircularProgress } from "@heroui/react";
import { Link } from "react-router";
import type { Advert } from "../../../types.d";

export default function AdvertCard(props: Advert) {
	return (
		<div className="border-1 border-zinc-300 rounded-2xl p-4 bg-white shadow-sm space-y-2">
			<div>
				<div className="flex justify-between gap-4">
					<div className="text-sm">
						<p>
							<span className="font-medium">{props.title}</span>
						</p>
						<p>
							<span className="font-medium">Platform:</span>{" "}
							<span>{props.platforms}</span>
						</p>
					</div>

					<p className="text-lg font-semibold">
						₦{props.payment_per_task?.toLocaleString()}
					</p>
				</div>
			</div>

			<div className="flex justify-between items-center">
				<span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
					Available
				</span>
				<CircularProgress
					color={
						props.completion_percentage > 69
							? "success"
							: props.completion_percentage < 44
								? "warning"
								: "danger"
					}
					formatOptions={{ style: "percent" }}
					showValueLabel
					size="sm"
					value={props.completion_percentage}
				/>
				<Link
					to={`/earn/adverts/${props.id}`}
					className="h-8 w-8 rounded-full inline-flex items-center justify-center border-1 border-zinc-800 text-zinc-800 transition-colors hover:bg-zinc-100"
				>
					<span style={{ fontSize: 14 }} className="material-icons-outlined">
						north_east
					</span>
				</Link>
			</div>
		</div>
	);
}
