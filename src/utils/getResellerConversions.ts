import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";


export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Conversion {
  id: number;
  product_id: number;
  reseller_code: string;
  visitor_cookie: string;
  ip: string;
  user_agent: string;
  commission_rate: number;
  product: Product;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export async function getResellerConversions(
  page: number = 1,
  signal?: AbortSignal
): Promise<PaginatedResponse<Conversion>> {
  const response = await fetch(`${apiEndpointBaseURL}/reseller/conversions?page=${page}`, {
    credentials: "include",
    signal,
    headers: {
      "Accept": "application/json",
      "Authorization": getAuthorization(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load conversions (status ${response.status})`);
  }

  const json = await response.json();
  return json.data; // Laravel returns { status, data: pagination structure }
}
