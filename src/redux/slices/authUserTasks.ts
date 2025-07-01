import {
  createSlice,
  type SliceCaseReducers,
  type SliceSelectors,
} from "@reduxjs/toolkit";
import type { Task } from "../../../types";

const authUserTasks = createSlice<
  { value: Task[] | null },
  SliceCaseReducers<{ value: Task[] | null }>,
  string,
  SliceSelectors<{ value: Task[] | null }>,
  string
>({
  name: "authUserTasks",
  initialState: {
    value: [],
  },
  reducers: {
    setAuthUserTasks(state, action: { payload: Task[] }) {
      state.value = action.payload;
    },
  },
});

export const { setAuthUserTasks } = authUserTasks.actions;
export default authUserTasks.reducer;
