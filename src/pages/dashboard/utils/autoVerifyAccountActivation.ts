import { toast } from "sonner";
import type { AuthUserDTO } from "../../../../types";
import getAuthUser from "../../../utils/getAuthUser";
import { setAuthUser } from "../../../redux/slices/auth";
import type { UseDispatch } from "react-redux";

export default async function autoVerifyAccountActivation(
	dispatch: ReturnType<UseDispatch>,
) {
	const authUser: AuthUserDTO = await getAuthUser();
	if (authUser.email_verified_at) {
		toast.success("Account verified successfully!");
		dispatch(setAuthUser(authUser));
	}
}
