import { useDispatch, useSelector } from "react-redux";
import type { ProductStore } from "../../types";
import { setCategories } from "../redux/slices/products";
import { useCallback, useEffect } from "react";
import getProductsCategories from "../utils/getProductsCategories";

export default function useProductCategories() {
	const categories = useSelector<{ products: { categories: ProductStore["categories"] } }, ProductStore["categories"]>(
		(state) => state.products.categories,
	);
	const dispatch = useDispatch();

	const refresh = useCallback(async () => {
		try {
			const productCategories = await getProductsCategories();
			dispatch(setCategories(productCategories));
		} catch {
			setTimeout(() => {
				refresh();
			}, 3000);
		}
	}, [dispatch]);

	useEffect(() => {
		if (categories === null)
			refresh();
	}, [categories, refresh]);

	return { categories, refresh };
}
