import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import SideNav from "./SideNav";
import useAutoRefreshUser from "../hooks/useAutoRefreshUser"; // ✅ new hook
import Loading from "../shared/components/Loading";
import { useEffect } from "react";
export default function RootLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const user = useAutoRefreshUser(); // ✅ Automatically fetches and keeps user updated

	useEffect(() => {
		if (!user) return;

		const allowedPaths = [
			"/VerifyEmail",
			"/become-a-member",
			"/choose-online-payment-method",
			"/payment/callback",
			"/advertise",
			"/advertise/tasks-history",
			"/advertise/task-performance/:id",
			"/advertise/post-advert",
			"/advertise/engagement-tasks",
			"/fund-wallet",
		];

		const isAllowedPath = allowedPaths.some((path) =>
			path.includes(":")
				? location.pathname.startsWith(path.split("/:")[0])
				: location.pathname === path
		);

		if (!user.email_verified_at && !isAllowedPath) {
			navigate("/VerifyEmail", { replace: true });
		} else if (!user.is_member && !isAllowedPath) {
			navigate("/become-a-member", { replace: true });
		} else if (
			user.advertise_count === 0 &&
			user.task_count === 0 &&
			!isAllowedPath
		) {
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
