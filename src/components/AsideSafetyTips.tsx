export default function AsideSafetyTips({ tips }: { tips: string[] }) {
	return (
		<div>
			<p className="font-medium">Safety Tips</p>

			<ul>
				{tips.map((tip, i) => (
					<li key={i} className="flex items-center gap-2 text-xs text-gray-500">
						{tip}
					</li>
				))}
			</ul>
		</div>
	);
}
