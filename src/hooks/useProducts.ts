import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Product } from "../../types";
import { setProducts } from "../redux/slices/products";
import getProducts from "../utils/getProducts";

export default function useProducts() {
	const products = useSelector<{ products: { value: Product[] } }, Product[] | null>(
		(state) => state.products.value,
	);
	const authUserId = useSelector<{ auth: { value: { id: string } } }, string>(
		(state) => state.auth.value.id,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchProducts() {
			try {
				dispatch(setProducts(await getProducts()));
			} catch {
				setTimeout(fetchProducts, 3000);
			}
		}

		if (!products) fetchProducts();
	}, [products, dispatch]);

	return {
		products,
		reload: () => dispatch(setProducts(null)),
	};
}
