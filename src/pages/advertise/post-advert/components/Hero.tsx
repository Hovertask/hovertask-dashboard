import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
	return (
		<div className="bg-gradient-to-r from-white via-primary/30 to-white px-4 pt-4 rounded-2xl">
			<div className="flex gap-6 max-mobile:gap-4">
				<Link to="/advertise">
					<ArrowLeft />
				</Link>

				<div className="flex justify-center items-center">
					<div>
						<img
							src="/images/Premium_Photo___Composition_with_smartphone_used_for_digital_shopping_and_online_ordering-removebg-preview 2.png"
							width={250}
							alt=""
						/>
					</div>
					<h1 className="text-2xl text-primary text-center">
						Advertise on <br /> Social Media
					</h1>
				</div>
			</div>
		</div>
	);
}
