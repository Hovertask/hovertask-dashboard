import { Search } from "lucide-react";
import type { InputHTMLAttributes, FormEvent } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
	onSearch?: (value: string) => void;
};

export default function MarketplaceSearchForm({ onSearch, ...props }: Props) {
	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const input = target.querySelector("input") as HTMLInputElement;
		onSearch?.(input.value);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="p-2 px-4 bg-white/90 rounded-3xl flex w-full max-w-md gap-4"
		>
			<div className="border p-2 rounded-full bg-white flex-1 flex items-center gap-2">
				<input
					type="text"
					{...props}
					className="min-w-0 w-full outline-none"
				/>

				<button type="submit">
					<Search size={12} />
				</button>

				<button type="button">
					<span
						style={{ fontSize: 12 }}
						className="material-icons-outlined text-primary"
					>
						tune
					</span>
				</button>
			</div>

			<div className="text-xs flex items-center gap-4">
				<span>Location:</span>

				<button type="button" className="flex items-center gap-1">
					Nigeria
					<span style={{ fontSize: 12 }} className="material-icons-outlined">
						arrow_drop_down
					</span>
				</button>
			</div>
		</form>
	);
}
