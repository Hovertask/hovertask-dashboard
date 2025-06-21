import {
	createSlice,
	type SliceCaseReducers,
	type SliceSelectors,
} from "@reduxjs/toolkit";
import type { AuthUserDTO } from "../../../types";

const authSlice = createSlice<
	{ value: AuthUserDTO | null },
	SliceCaseReducers<{ value: AuthUserDTO | null }>,
	string,
	SliceSelectors<{ value: AuthUserDTO | null }>,
	string
>({
	name: "auth",
	initialState: {
		value: {
			id: 3,
			fname: "Victor",
			lname: "Onah",
			email: "victoronah.dev@gmail.com",
			username: "Victor13",
			phone: "09035495410",
			how_you_want_to_use: "earner",
			country: "nigeria",
			currency: "ngn",
			avatar: null,
			email_verified_at: "null",
			referral_username: null,
			referral_code: null,
			referred_by: null,
			created_at: "2025-03-12T18:39:07.000000Z",
			updated_at: "2025-03-12T18:39:07.000000Z",
			balance: 0,
			account_status: "active",
		},
	},
	reducers: {
		logout(state) {
			state.value = null;
		},
		setAuthUser(state, action: { payload: AuthUserDTO }) {
			state.value = action.payload;
		},
		setAuthUserFields(state, action: { payload: Partial<AuthUserDTO> }) {
			const { payload } = action;
			state.value = { ...state.value, ...payload } as AuthUserDTO;
		},
	},
});

export const { logout, setAuthUser, setAuthUserFields } = authSlice.actions;
export default authSlice.reducer;
