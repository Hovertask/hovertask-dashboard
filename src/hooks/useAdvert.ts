import type { Advert } from "../../types.d";
import { useEffect, useState } from "react";
import useAdverts from "./useAdverts";

export default function useAdvert(id: string) {
	const { adverts } = useAdverts();
	const [advert, setAdvert] = useState<Advert | null | undefined>(null);

	useEffect(() => {
		if (adverts?.length) {
			const numericId = Number(id);
			setAdvert(adverts.find(advert => advert.id === numericId));
		} else {
			setAdvert(undefined);
		}
	}, [adverts, id]);

	return advert;
}
