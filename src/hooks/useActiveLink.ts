import { useLocation } from "react-router";
import menu from "../utils/menu";
import { useEffect, useState } from "react";

export default function useActiveLink() {
	const { pathname } = useLocation();
	const [activePath, setActivePath] = useState<string>("");

	useEffect(() => {
		const activeMenu = menu.find(
			(item) =>
				item.path === pathname ||
				item.basePath === pathname ||
				(pathname.includes(item.path || item.basePath || "") &&
					item.label !== "Dashboard"),
		);

		if (activeMenu)
			setActivePath(activeMenu.path || activeMenu.basePath || "/");
		else setActivePath("/");
	}, [pathname]);

	return activePath;
}
