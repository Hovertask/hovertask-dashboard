import { ChevronDown, DollarSign } from "lucide-react";

export default function Greeting({
	lname,
	how_you_want_to_use,
}: { lname?: string; how_you_want_to_use?: string }) {
	return (
		<div className="flex justify-between">
			<h1 className="text-[18.66px] font-light">
				Welcome back, <br />
				<span className="capitalize font-normal">{lname}</span>
			</h1>
			<div className="bg-[#10AF88] text-white py-1.5 px-3 rounded-lg inline-flex items-center gap-2 text-sm h-fit">
				<DollarSign size={14} />{" "}
				<span className="capitalize">{how_you_want_to_use}</span>{" "}
				<ChevronDown size={16} />
			</div>
		</div>
	);
}
