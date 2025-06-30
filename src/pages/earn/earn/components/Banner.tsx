import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Banner() {
	return (
		<div className="bg-primary/20 p-6 rounded-3xl relative">
			<div className="flex gap-4 max-w-xs">
				<Link className="mt-1" to="/">
					<ArrowLeft />
				</Link>

				<div className="space-y-2">
					<h1 className="text-xl">Choose Your Earning Path</h1>
					<p className="text-[#5E5E62] font-light">
						Select how want to earn and start making money today
					</p>
				</div>
			</div>

			<div className="max-w-md flex justify-center">
				<img
					width={138}
					src="/images/3D_rendering_of_new_1000_Nigerian_naira_notes_flying_in_different_angles_and_orientations_isolated_on_transparent_background-removebg-preview 1.png"
					alt=""
				/>
			</div>

			<div className="absolute max-mobile:hidden right-4 -top-16">
				<img
					src="/images/Social_Media_-_Sandrin_Design_-_11_-_sandrin__-removebg-preview 1.png"
					width={280}
					alt=""
				/>
			</div>
		</div>
	);
}
