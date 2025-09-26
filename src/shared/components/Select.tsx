import {
	Autocomplete,
	AutocompleteItem,
	type AutocompleteProps,
	Select,
	SelectItem,
	type SelectProps,
	Selection,
} from "@heroui/react";
import cn from "../../utils/cn";

type Option = { key: string; label: string };

interface CustomSelectProps
	extends Omit<SelectProps & AutocompleteProps, "children" | "onChange"> {
	options: Option[];
	isAutoComplete?: boolean;
	onChange?: (value: string) => void; // ✅ simplified signature
	errorMessage?: string;
}

export default function CustomSelect({
	isAutoComplete,
	options,
	label,
	className,
	onChange,
	errorMessage,
	...rest
}: CustomSelectProps) {
	return (
		<div className="space-y-1">
			<label className="text-sm" htmlFor={rest.id}>
				{label}
			</label>

			{isAutoComplete ? (
				<Autocomplete
					labelPlacement="outside"
					{...rest}
					onSelectionChange={(keys) => {
						let value = "";
						if (typeof keys === "string") {
							value = keys;
						} else if (keys && keys.size > 0) {
							value = Array.from(keys)[0]?.toString() ?? "";
						}
						onChange?.(value);
					}}
					className={cn(
						"[&_div[data-slot='main-wrapper']]:border-1 [&_div[data-slot='main-wrapper']]:bg-zinc-200/50 [&_div[data-slot='main-wrapper']]:border-zinc-300 [&_div[data-slot='main-wrapper']]:rounded-lg",
						className,
					)}
				>
					{options.map((type) => (
						<AutocompleteItem key={type.key}>{type.label}</AutocompleteItem>
					))}
				</Autocomplete>
			) : (
				<Select
					labelPlacement="outside"
					{...rest}
					onSelectionChange={(keys: Selection) => {
						let value = "";
						if (typeof keys === "string") {
							value = keys;
						} else if (keys && keys.size > 0) {
							value = Array.from(keys)[0]?.toString() ?? "";
						}
						onChange?.(value);
					}}
					className={cn(
						"[&_button]:border-1 [&_button]:bg-200/50 [&_button]:border-zinc-300 [&_button]:rounded-lg",
						className,
					)}
				>
					{options.map((type) => (
						<SelectItem key={type.key}>{type.label}</SelectItem>
					))}
				</Select>
			)}

			{errorMessage && (
				<small className="text-danger">{errorMessage}</small>
			)}
		</div>
	);
}
