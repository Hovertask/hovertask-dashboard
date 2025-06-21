import cn from "../../../utils/cn";

export default function FeatureCard({
	rotateClassName,
	index,
	icon,
	title,
	description,
}: {
	rotateClassName: string;
	index: number;
	title: string;
	description: string;
	icon: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"relative bg-primary/10 p-4 rounded-2xl text-sm text-center flex flex-col items-center justify-center gap-1",
				rotateClassName,
			)}
		>
			<span className="absolute text-xs top-4 left-4">{index}.</span>
			<div className="text-primary">{icon}</div>
			<h4 className="text-base text-primary font-medium">{title}</h4>
			<p className="text-center">{description}</p>
		</div>
	);
}
