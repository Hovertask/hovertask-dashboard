import { Link } from "react-router";

export default function EarningOptionCard(props: {
	title: string;
	description: string;
	imageUrl: string;
	linkText: string;
	linkUrl: string;
	number: number;
}) {
	return (
		<div className="flex max-sm:flex-wrap justify-between gap-4 shadow-inner border border-zinc-300 p-6 rounded-3xl bg-white items-center">
			<span className="bg-primary h-[31.39px] min-w-[47.77px] rounded-[60%] text-white text-[17.74px] flex items-center justify-center">
				{props.number}
			</span>
			<div className="text-center">
				<p className="text-xs">{props.title}</p>
				<p className="text-xs font-light text-[#5E5E62]">{props.description}</p>
			</div>
			<img className="max-sm:w-full" src={props.imageUrl} width={116} alt="" />
			<Link
				className="border-primary border rounded-2xl text-[10px] text-primary text-center whitespace-nowrap h-fit p-4 -rotate-2 transition-all hover:rotate-0 hover:bg-primary/10 max-sm:flex-1"
				to={props.linkUrl}
			>
				{props.linkText}
			</Link>
		</div>
	);
}
