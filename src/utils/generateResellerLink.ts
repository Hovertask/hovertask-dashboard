import apiEndpointBaseURL from "./apiEndpointBaseURL";

export default async function generateResellerLink(id: string) {
	const url = apiEndpointBaseURL + `/products/reseller-link/${id}`;
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				// use the canonical header name
				Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				"Content-Type": "application/json",
			},
		});

		// try to parse body as json (safe fallback to empty object)
		const body = await res.json().catch(() => ({}));

		if (!res.ok) {
			const msg = (body && (body.message || body.error)) || `Request failed with status ${res.status}`;
			throw new Error(msg);
		}

		// normalize common shapes: { data: { reseller_url } } or { reseller_url } or { url }
		if (body && body.data && (body.data.reseller_url || body.data.url)) {
			return { data: { reseller_url: body.data.reseller_url || body.data.url }, raw: body };
		}

		if (body && (body.reseller_url || body.url)) {
			return { data: { reseller_url: body.reseller_url || body.url }, raw: body };
		}

		// otherwise return the raw body (caller will fallback to product URL)
		return { raw: body };
	} catch (err) {
		// bubble up error for callers to handle
		throw err;
	}
}
