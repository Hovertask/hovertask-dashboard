import {
	createSlice,
	type SliceCaseReducers,
	type SliceSelectors,
} from "@reduxjs/toolkit";
import type { Advert } from "../../../types.d";

const advertsSlice = createSlice<
	{ value: Advert[] | null },
	SliceCaseReducers<{ value: Advert[] | null }>,
	string,
	SliceSelectors<{ value: Advert[] | null }>,
	string
>({
	name: "adverts",
	initialState: {
		value: null,
	},
	reducers: {
		setAdverts(state, action: { payload: Advert[] }) {
			state.value = action.payload;
		},
	},
});

export const { setAdverts } = advertsSlice.actions;
export default advertsSlice.reducer;
