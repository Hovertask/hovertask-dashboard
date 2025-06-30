import {
	createSlice,
	type SliceCaseReducers,
	type SliceSelectors,
} from "@reduxjs/toolkit";
import type { Task } from "../../../types.d";

const tasksSlice = createSlice<
	{ value: Task[] | null },
	SliceCaseReducers<{ value: Task[] | null }>,
	string,
	SliceSelectors<{ value: Task[] | null }>,
	string
>({
	name: "tasks",
	initialState: {
		value: null,
	},
	reducers: {
		setTasks(state, action: { payload: Task[] }) {
			state.value = action.payload;
		},
	},
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
