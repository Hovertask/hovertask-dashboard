import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import SideNav from "./SideNav";
import { useEffect } from "react";
import getAuthUser from "../utils/getAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/slices/auth";
import Loading from "../shared/components/Loading";
import type { AuthUserDTO } from "../../types";

export default function RootLayout() {
	const dispatch = useDispatch();
	const user = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
		(state) => state.auth.value,
	);
		const navigate = useNavigate();
		const location = useLocation();

	useEffect(() => {
		async function fetchUser() {
			try {
				dispatch(setAuthUser(await getAuthUser()));
			} catch {
				setTimeout(fetchUser, 3000);
			}
		}

		if (!user) fetchUser();
	}, [dispatch, user]);

	useEffect(() => {
		if (!user) return;

		const pathname = location.pathname;

		// Step 1: Email verification must be completed first.
		// If not verified, only allow the verification and payment callback flows.
		if (!user.email_verified_at) {
			const allowed = ["/VerifyEmail", "/payment/callback", "/choose-online-payment-method"];
			if (!allowed.includes(pathname)) {
				navigate("/VerifyEmail", { replace: true });
			}
			return;
		}

		// Step 2: After email verified, require membership before other areas.
		if (!user.is_member) {
			const allowed = ["/become-a-member", "/choose-online-payment-method", "/payment/callback"];
			if (!allowed.includes(pathname)) {
				navigate("/become-a-member", { replace: true });
			}
			return;
		}

		// Step 3: After membership, encourage creating adverts/tasks by routing to /advertise
		if (user.advertise_count === 0 && user.task_count === 0) {
			// allow any advertise sub-paths
			if (!pathname.startsWith("/advertise")) {
				navigate("/advertise", { replace: true });
			}
			return;
		}
	}, [user, navigate, location]);


	return (
		<>
			{user ? (
				<div>
					<Header />

					<div className="bg-container">
						<div className="grid grid-cols-1 mobile:grid-cols-[243px_1fr] max-w-[1181px] mx-auto mobile:px-4 gap-4">
							<aside className="max-mobile:hidden">
								<SideNav />
							</aside>
							<main className="overflow-hidden min-h-screen">
								<Outlet />
							</main>
						</div>
					</div>
				</div>
			) : (
				<Loading fixed />
			)}
		</>
	);
	}
