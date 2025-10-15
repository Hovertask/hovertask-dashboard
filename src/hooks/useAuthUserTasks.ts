import { useEffect, useState, useCallback } from "react";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";

export default function useAuthUserTasks(type: string) {
  const [tasks, setTasks] = useState<any[] | null>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiEndpointBaseURL}/tasks/completed-task-history?type=${type}`,
        {
          headers: {
            authorization: getAuthorization(),
          },
        }
      );

      const data = await res.json();
      if (data.status) {
        setTasks(data.data);
        setStats(data.stats || {});
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    stats,
    reload: fetchTasks,
    loading,
  };
}
