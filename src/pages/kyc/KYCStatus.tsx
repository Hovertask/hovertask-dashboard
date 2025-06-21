import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function KYCStatusPage() {
	return (
		<div className="mobile:flex gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 max-w-[724px] space-y-6 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<h1 className="text-2xl">KYC Verification</h1>
				</div>

				<div />
			</div>
		</div>
	);
}
