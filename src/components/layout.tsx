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

	const allowedPaths = [
		"/VerifyEmail",
		"/become-a-member",
		"/choose-online-payment-method",
		"/payment/callback",
		"/advertise", // allow advertise page itself
		"/advertise/tasks-history",
		"/advertise/task-performance/:id",
		"/advertise/post-advert?platform=${platform}",
		"/advertise/engagement-tasks",
		
	];

	if (!user.email_verified_at && !allowedPaths.includes(location.pathname)) {
		navigate("/VerifyEmail", { replace: true });
	} else if (!user.is_member && !allowedPaths.includes(location.pathname)) {
		navigate("/become-a-member", { replace: true });
	} else if (
		user.advertise_count === 0 &&
		user.task_count === 0 &&
		!allowedPaths.includes(location.pathname)
	) {
		// if user has not created any advert or task
		navigate("/advertise", { replace: true });
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
