import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Advert } from "../../../../../types.d";
import AdvertCard from "../../../../shared/components/AdvertCard";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../utils/getAuthorization";
import { setAdverts } from "../../../../redux/slices/adverts";

interface AvailableJobsProps {
	filter?: string; // 👈 filter by platform (facebook, whatsapp, etc)
}

export default function AvailableJobs({ filter }: AvailableJobsProps) {
	const dispatch = useDispatch();

	const adverts = useSelector<{ authUserTasks: { value: Advert[] | null } }, Advert[] | null>(
		(state) => state.authUserTasks?.value
	);

	const [data, setData] = useState<Advert[] | null>(adverts);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAdverts = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${apiEndpointBaseURL}/advertise/show-all-advert`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: getAuthorization(),
					},
				});
				const result = await response.json();

				if (result.status && result.data) {
					setData(result.data);
					dispatch(setAdverts(result.data));
				} else {
					console.warn("No adverts found or invalid response:", result);
				}
			} catch (error) {
				console.error("Error fetching adverts:", error);
			} finally {
				setLoading(false);
			}
		};

		if (!adverts) fetchAdverts();
		else setData(adverts);
	}, [adverts, dispatch]);

	// ✅ Filter adverts by selected category/platform
	const filteredAdverts = data?.filter((advert) =>
		advert.platforms?.toLowerCase().includes(filter?.toLowerCase() || "")
	);

	return (
		<div className="space-y-3">
			<h2 className="text-[21.35px] font-semibold capitalize">
				{filter ? `Adverts for ${filter}` : "New Available Adverts"}
			</h2>

			<div className="space-y-4">
				{loading ? (
					<p className="text-gray-500 text-sm">Loading adverts...</p>
				) : filteredAdverts?.length ? (
					filteredAdverts.map((advert) => <AdvertCard {...advert} key={advert.id} />)
				) : (
					<p className="text-gray-500 text-sm">
						No adverts available for {filter || "this category"} yet.
					</p>
				)}
			</div>
		</div>
	);
}
