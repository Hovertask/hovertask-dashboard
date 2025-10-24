import {
  Autocomplete,
  AutocompleteItem,
  type AutocompleteProps,
  Select,
  SelectItem,
  type SelectProps,
} from "@heroui/react";
import cn from "../../utils/cn";

type Option = { key: string; label: string };

type CustomSelectProps = Omit<SelectProps, "children" | "onChange"> &
  Omit<AutocompleteProps, "children" | "onChange"> & {
    options: Option[];
    isAutoComplete?: boolean;
    errorMessage?: string;
    onChange?: (value: string) => void;
  };

export default function CustomSelect(props: CustomSelectProps) {
  const { isAutoComplete, options, label, className, onChange, ...rest } = props;

  return (
    <div className="space-y-1">
      <label className="text-sm" htmlFor={props.id}>
        {label}
      </label>

      {isAutoComplete ? (
        <Autocomplete
          labelPlacement="outside"
          {...rest}
          onInputChange={(value) => {
            onChange?.(value); // always string
          }}
          className={cn(
            "[&_div[data-slot='main-wrapper']]:border-1 [&_div[data-slot='main-wrapper']]:bg-zinc-200/50 [&_div[data-slot='main-wrapper']]:border-zinc-300 [&_div[data-slot='main-wrapper']]:rounded-lg [&_div[data-slot='listboxWrapper']]:min-w-full [&_div[data-slot='listbox']]:bg-white [&_div[data-slot='listbox']]:rounded-lg [&_div[data-slot='listbox']]:shadow-md",
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
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onChange?.(value); // always string
          }}
          className={cn(
            "[&_button]:border-1 [&_button]:bg-zinc-200/50 [&_button]:border-zinc-300 [&_button]:rounded-lg [&_div[data-slot='listboxWrapper']]:min-w-full [&_div[data-slot='listbox']]:bg-white [&_div[data-slot='listbox']]:rounded-lg [&_div[data-slot='listbox']]:shadow-md",
            className,
          )}
        >
          {options.map((type) => (
            <SelectItem key={type.key}>{type.label}</SelectItem>
          ))}
        </Select>
      )}

      {props.errorMessage && (
        <small className="text-danger">{props.errorMessage}</small>
      )}
    </div>
  );
}
