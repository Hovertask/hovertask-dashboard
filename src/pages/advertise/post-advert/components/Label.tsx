export default function Label({
	title,
	description,
}: { title: string; description: string }) {
	return (
		<div>
			<p className="font-medium">{title}</p>
			<p className="text-xs">{description}</p>
		</div>
	);
}
