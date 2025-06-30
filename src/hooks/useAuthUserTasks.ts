import type { Task } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/slices/authUserTasks";

const useAuthUserTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: { authUserTasks: { value: (Task & { admin_approval_status: string, link?: string })[] } }) => state.authUserTasks.value);
  const reload = () => dispatch(setTasks(null))

  console.log(tasks)

  return {
    tasks,
    reload
  }
}

export default useAuthUserTasks;