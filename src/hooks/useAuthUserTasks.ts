import type { Task } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUserTasks } from "../redux/slices/authUserTasks";
import { useEffect } from "react";
import getAuthUserTasks from "../pages/earn/utils/getAuthUserTasks";

const useAuthUserTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: { authUserTasks: { value: (Task & { admin_approval_status: string, link?: string })[] } }) => state.authUserTasks.value);
  const reload = () => dispatch(setAuthUserTasks(null))

  useEffect(() => {
    if (!tasks) (async () => dispatch(setAuthUserTasks(await getAuthUserTasks())))()
  }, [tasks, dispatch])

  return {
    tasks,
    reload
  }
}

export default useAuthUserTasks;