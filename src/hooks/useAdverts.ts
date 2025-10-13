import { useDispatch, useSelector } from "react-redux";
import type { Advert } from "../../types";
import { setAdverts } from "../redux/slices/adverts";
import { useEffect } from "react";
import getAdverts from "../utils/getAdverts";

export default function useAdverts() {
	const adverts = useSelector<{ adverts: { value: Advert[] | null } }, Advert[] | null>(
		(state) => state.adverts.value,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		async function loadAdverts() {
			try {
				dispatch(setAdverts(await getAdverts()));
			} catch {
				setTimeout(loadAdverts, 3000); // retry after 3 seconds on failure
			}
		}

		if (!adverts) loadAdverts();
	}, [adverts, dispatch]);

	return { adverts, reload: () => dispatch(setAdverts(null)) };
}
