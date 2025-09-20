import { Outlet, useNavigate } from "react-router";
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
