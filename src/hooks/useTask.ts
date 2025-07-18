import type { Task } from "../../types.d";
import { useEffect, useState } from "react";
import useTasks from "./useTasks";

export default function useTask(id: string) {
	const { tasks } = useTasks();
	const [task, setTask] = useState<Task | null | undefined>(null);

	useEffect(() => {
		if (tasks?.length)
			setTask(tasks.find(task => task.id === id))
		else setTask(undefined)
	}, [tasks, id])

	return task;
}
