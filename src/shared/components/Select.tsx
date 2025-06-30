import {
	Autocomplete,
	AutocompleteItem,
	type AutocompleteProps,
	Select,
	SelectItem,
	type SelectProps,
} from "@heroui/react";
import cn from "../../utils/cn";

export default function CustomSelect(
	props: Omit<SelectProps & AutocompleteProps, "children"> & {
		options: { key: string; label: string }[];
		isAutoComplete?: boolean;
	},
) {
	const { isAutoComplete, options, label, className, ...rest } = props;

	return (
		<div className="space-y-1">
			<label className="text-sm" htmlFor={props.id}>
				{label}
			</label>
			{isAutoComplete ? (
				<Autocomplete
					labelPlacement="outside"
					{...rest}
					className={cn(
						"[&_div[data-slot='main-wrapper']]:border-1 [&_div[data-slot='main-wrapper']]:bg-zinc-200/50 [&_div[data-slot='main-wrapper']]:border-zinc-300 [&_div[data-slot='main-wrapper']]:rounded-lg",
						className,
					)}
				>
					{props.options.map((type) => (
						<AutocompleteItem key={type.key}>{type.label}</AutocompleteItem>
					))}
				</Autocomplete>
			) : (
				<Select
					labelPlacement="outside"
					{...rest}
					className={cn(
						"[&_button]:border-1 [&_button]:bg-200/50 [&_button]:border-zinc-300 [&_button]:rounded-lg",
						className,
					)}
				>
					{props.options.map((type) => (
						<SelectItem key={type.key}>{type.label}</SelectItem>
					))}
				</Select>
			)}
			{props.errorMessage && (
				<small className="text-danger">{props.errorMessage as string}</small>
			)}
		</div>
	);
}
