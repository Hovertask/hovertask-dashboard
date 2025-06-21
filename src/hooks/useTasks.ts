import { useDispatch, useSelector } from "react-redux";
import type { Task } from "../../types";
import { setTasks } from "../redux/slices/tasks";
import { useEffect } from "react";
import getTasks from "../utils/getTasks";

export default function useTasks() {
	const tasks = useSelector<{ tasks: { value: Task[] | null } }, Task[] | null>(
		(state) => state.tasks.value,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		async function loadTasks() {
			try {
				dispatch(setTasks(await getTasks()));
			} catch {
				setTimeout(loadTasks, 3000); // On failure, retry after 3 seconds
			}
		}

		if (!tasks) loadTasks();
	}, [tasks, dispatch]);

	return { tasks, reload: () => dispatch(setTasks(null)) };
}
