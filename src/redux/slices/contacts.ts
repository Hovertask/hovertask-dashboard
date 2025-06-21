import {
	createSlice,
	SliceCaseReducers,
	SliceSelectors,
} from "@reduxjs/toolkit";
import { ContactCardProps } from "../../../types";

interface ContactsState {
	people: ContactCardProps[] | null;
	groups: ContactCardProps[] | null;
	user: {
		people: ContactCardProps[] | null;
		groups: ContactCardProps[] | null;
	};
}

const contacts = createSlice<
	ContactsState,
	SliceCaseReducers<ContactsState>,
	string,
	SliceSelectors<ContactsState>,
	string
>({
	name: "contacts",
	initialState: {
		people: null,
		groups: null,
		user: {
			people: null,
			groups: null,
		},
	},
	reducers: {
		setPeople(state, action: { payload: ContactCardProps[] }) {
			state.people = action.payload;
		},
		setGroups(state, action: { payload: ContactCardProps[] }) {
			state.groups = action.payload;
		},
	},
});

export const { setPeople, setGroups } = contacts.actions;
export default contacts.reducer;
