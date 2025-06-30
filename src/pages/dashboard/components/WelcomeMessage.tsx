import { useEffect } from "react";
import { useDispatch } from "react-redux";
import autoVerifyAccountActivation from "../utils/autoVerifyAccountActivation";
import type { AuthUserDTO } from "../../../../types";
import requestVerificationEmail from "../utils/requestVerificationEmail";

export default function WelcomeMessage(props: AuthUserDTO) {
	const dispatch = useDispatch();

	useEffect(() => {
		const interval = setInterval(() => {
			if (!props.email_verified_at) autoVerifyAccountActivation(dispatch);
			else clearInterval(interval);
		}, 3000);

		return () => clearInterval(interval);
	}, [dispatch, props]);

	return props.email_verified_at ? (
		<div className="text-center">
			<h2 className="text-[31.03px] text-success">You are now a MEMBER</h2>
			<p className="text-[13.87px]">
				Your membership has been successfully activated. Start earning daily by
				posting adverts and completing tasks on your social media accounts.
			</p>
		</div>
	) : (
		<div className="text-center text-[13.87px]">
			<h2 className="text-[20.8px]">Welcome To The Website</h2>
			<p>
				Earn by completing simple social media tasks or advertise your products
				to the right audience.
			</p>
			<button
				type="button"
				onClick={async () => requestVerificationEmail(props.email)}
				className="text-danger underline mx-auto"
			>
				Kindly Verify Your Account
			</button>
			<p className="mt-4">
				Get access to all the services with just ₦1,000{" "}
				<span className="font-medium">ONLY</span> verify your account now!
			</p>
		</div>
	);
}
