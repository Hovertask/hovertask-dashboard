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
		value: null,
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
