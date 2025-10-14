import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getAuthUser from "../utils/getAuthUser";
import { setAuthUser } from "../redux/slices/auth";
import type { AuthUserDTO } from "../../types";

/**
 * Automatically keeps the authenticated user up-to-date.
 * Fetches user data initially and refreshes periodically (every 15 seconds by default).
 */
export default function useAutoRefreshUser(intervalTime: number = 15000) {
  const dispatch = useDispatch();
  const user = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
    (state) => state.auth.value
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // ✅ fixed type

    async function fetchUser() {
      try {
        const freshUser = await getAuthUser();
        dispatch(setAuthUser(freshUser));
      } catch {
        // retry softly on error (e.g. token expired, network)
        setTimeout(fetchUser, 3000);
      }
    }

    // Initial fetch
    if (!user) fetchUser();

    // Periodic refresh
    interval = setInterval(fetchUser, intervalTime);

    return () => clearInterval(interval);
  }, [dispatch, user, intervalTime]);

  return user;
}
