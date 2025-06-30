import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Banner() {
	return (
		<div className="flex">
			<div className="flex gap-4 flex-1 max-w-[460px]">
				<Link className="mt-1" to="/earn">
					<ArrowLeft />
				</Link>

				<div>
					<h1 className="text-xl font-semibold">
						Turn Your Social Media Into an Earning Platform
					</h1>
					<p className="text-secondary font-light">
						Pick from a variety of tasks or start posting adverts for rewards.
					</p>
				</div>
			</div>

			<div className="max-sm:hidden">
				<img
					src="/images/0c3e01cf-a60e-4e42-8a1d-6ba21eb32eeb-removebg-preview 2.png"
					width={212}
					alt=""
				/>
			</div>
		</div>
	);
}
