import {
	createSlice,
	SliceCaseReducers,
	SliceSelectors,
} from "@reduxjs/toolkit";
import { Product, ProductStore } from "../../../types";

const productsSlice = createSlice<
	ProductStore,
	SliceCaseReducers<ProductStore>,
	string,
	SliceSelectors<ProductStore>,
	string
>({
	name: "products",
	initialState: {
		value: null,
		categories: null,
	},
	reducers: {
		setProducts(state, action: { payload: Product[] | null }) {
			state.value = action.payload;
		},
		setCategories(state, action: { payload: ProductStore["categories"] }) {
			state.categories = action.payload;
		},
	},
});

export const { setProducts, setCategories } = productsSlice.actions;
export default productsSlice.reducer;
