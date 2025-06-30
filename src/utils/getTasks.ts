import type { Task } from "../../types";
import apiEndpointBaseURL from "./apiEndpointBaseURL";
import getAuthorization from "./getAuthorization";

export default async function getTasks() {
	const response = await fetch(`${apiEndpointBaseURL}/tasks/show-all-task`, {
		headers: {
			authorization: getAuthorization(),
		},
	});

	return (await response.json()).data as Task[];
}
