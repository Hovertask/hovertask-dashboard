import {
	createSlice,
	SliceCaseReducers,
	SliceSelectors,
} from "@reduxjs/toolkit";
import { Task } from "../../../types";

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

export const { logout, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
