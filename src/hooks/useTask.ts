import { useSelector } from "react-redux";
import { Task } from "../../types";

export default function useTask(id: string): Task | null {
	return (
		useSelector<any, Task[] | null>((state) => state.tasks.value)?.find(
			(task) => task.id == id,
		) || null
	);
}
