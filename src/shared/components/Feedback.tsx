import cn from "../../utils/cn";

// TODO: Modify the props as necessary.
export default function Feedback({
	name,
	rating,
	comment,
	date,
}: {
	name: string;
	rating: number;
	comment: string;
	date: string;
}) {
	return (
		<div className="max-w-[294px] space-y-1">
			<div className="flex gap-2 items-center">
				<img width={28.089} src="images/defualt-user.png" alt={name} />
				<p className="flex items-center gap-2">
					<span className="text-[14.04px]">{name}</span>
					<img width={14.04} src="/images/nigerian-flag.png" alt="Flag" /> |{" "}
					<span className="text-[#77777A] text-[10.53px]">{date}</span>
				</p>
			</div>
			<div className="flex gap-1">
				{Array(5)
					.fill(true)
					.map((_, i) => (
						<span
							style={{ fontSize: 14 }}
							className={cn("material-icons text-zinc-600", {
								"text-warning": rating > i,
							})}
							key={Math.random()}
						>
							star
						</span>
					))}
			</div>
			<p className="text-[10.53px] text-[#77777A]">{comment}</p>
		</div>
	);
}
