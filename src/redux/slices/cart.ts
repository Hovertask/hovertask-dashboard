import {
	createSlice,
	type SliceCaseReducers,
	type SliceSelectors,
} from "@reduxjs/toolkit";
import type { CartProduct } from "../../../types.d";

const cartSlice = createSlice<
	{ value: CartProduct[] },
	SliceCaseReducers<{ value: CartProduct[] }>,
	string,
	SliceSelectors<{ value: CartProduct[] }>,
	string
>({
	name: "cart",
	initialState: {
		value: [],
	},
	reducers: {
		addProduct(state, action: { payload: CartProduct }) {
			const product = state.value.find(
				(product) => product.id === action.payload.id,
			);

			if (product) product.cartQuantity++;
			else state.value.push(action.payload);
		},
		removeProduct(state, action: { payload: string }) {
			const productIndex = state.value.findIndex(
				(product) => product.id === action.payload,
			);

			productIndex > -1 && state.value.splice(productIndex, 1);
		},
		updateQuantity(
			state,
			action: { payload: { id: string; direction: 0 | 1 } },
		) {
			const directions = [-2, 1];
			const product = state.value.find(
				(product) => product.id === action.payload.id,
			);

			if (product) product.cartQuantity += directions[action.payload.direction];
		},
	},
});

export const { addProduct, removeProduct, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
