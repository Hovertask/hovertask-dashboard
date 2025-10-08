import { Check } from "lucide-react";
import cn from "../../../../utils/cn";
import Input from "../../../../shared/components/Input";
import { toast } from "sonner"; // ✅ added toast notifications

export default function ConnectAccountInputGroup(props: {
	index: number;
	platform: string;
	changeHandlers: [(...args: any[]) => void, (...args: any[]) => void];
	placeholders: [forUsername: string, forProfileLink: string];
	values: [username: string, profileLink: string];
	validationState: string | boolean | undefined;
	validateFn(): boolean; // ✅ changed return type to boolean (so we know if valid)
}) {
	// ✅ Local submission function for each platform
	const handleLinkAccount = async () => {
		const isValid = props.validateFn(); // validate fields first

		if (!isValid) {
			toast.error(`Please enter a valid ${props.platform} username and profile link.`);
			return;
		}

		try {
			toast.loading(`Linking your ${props.platform} account...`, { id: props.platform });

			// 🟢 simulate backend submission (replace with your API call later)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success(`${props.platform} account linked successfully!`, {
				id: props.platform,
			});
		} catch (error) {
			console.error(error);
			toast.error(`Failed to link ${props.platform} account.`);
		}
	};

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

				{/* 🟢 if not validated yet, show link button */}
				{props.validationState === false && (
					<button
						onClick={handleLinkAccount} // ✅ changed from validateFn to handleLinkAccount
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

				{/*  if validated */}
				{props.validationState === true && <Check className="text-green-500" />}

				{/*  if validation returns string error */}
				{typeof props.validationState === "string" && (
					<span className="text-sm text-danger">{props.validationState}</span>
				)}

				{/*  pending review */}
				{props.validationState === undefined && <span>Pending review</span>}
			</div>
		</div>
	);
}
