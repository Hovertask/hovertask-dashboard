import { Check } from "lucide-react";
import cn from "../../../utils/cn";
import Input from "../../_shared/components/Input";

/** A concise and dynamic component for the link account form input groups. */
export default function ConnectAccountInputGroup(props: {
	index: number;
	platform: string;
	// biome-ignore lint/suspicious/noExplicitAny: Allow the use of any on this occasion
	changeHandlers: [(...args: any[]) => void, (...args: any[]) => void];
	placeholders: [forUsername: string, forProfileLink: string];
	values: [username: string, profileLink: string];
	validationState: string | boolean | undefined;
	validateFn(): void;
}) {
	return (
		<div className="space-y-4">
			<div className="text-sm flex items-center gap-4 pl-4">
				<span className="bg-primary px-5 py-1 rounded-[60%] text-white h-fit">
					{props.index}
				</span>
				<span className="capitalize">{props.platform}</span>
			</div>
			<div className="flex items-center gap-4">
				<div className="space-y-2 max-w-md w-full">
					<Input
						onChange={props.changeHandlers[0]}
						type="text"
						value={props.values[0]}
						placeholder={props.placeholders[0]}
					/>
					<Input
						onChange={props.changeHandlers[1]}
						type="url"
						value={props.values[1]}
						placeholder={props.placeholders[1]}
					/>
				</div>

				{props.validationState === false && (
					<button
						onClick={props.validateFn}
						disabled={!props.values[0] && !props.values[1]}
						className={cn(
							"whitespace-nowrap text-[10.84px] p-2 rounded-full text-secondary hover:bg-zinc-100 transition-all disabled:transform-none active:scale-95 disabled:cursor-not-allowed",
							{
								"hover:bg-primary/20 text-primary":
									props.values[0] && props.values[1],
							},
						)}
						type="button"
					>
						Link Account
					</button>
				)}

				{props.validationState === true && <Check />}

				{typeof props.validationState === "string" && (
					<span className="text-sm text-danger">{props.validationState}</span>
				)}

				{props.validationState === undefined && <span>Pending review</span>}
			</div>
		</div>
	);
}
