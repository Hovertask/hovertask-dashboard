// src/hooks/useRequirementPoll.ts
import { useEffect, useRef } from "react";

type Options<TUser> = {
  enabled?: boolean;
  refreshUser: () => Promise<TUser | null | undefined>;
  // return true when polling should stop (e.g. all requirements are satisfied)
  conditionToStop: (u: TUser | null | undefined) => boolean;
  initialIntervalMs?: number; // first poll interval (when not immediate)
  maxIntervalMs?: number;
  immediate?: boolean; // whether to run one immediate refresh on start
};

export default function useRequirementPoll<TUser = any>({
  enabled = true,
  refreshUser,
  conditionToStop,
  initialIntervalMs = 5000,
  maxIntervalMs = 60000,
  immediate = true,
}: Options<TUser>) {
  const runningRef = useRef(false);
  const intervalRef = useRef(initialIntervalMs);
  const stoppedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    stoppedRef.current = false;
    runningRef.current = false;
    intervalRef.current = initialIntervalMs;

    async function tick() {
      if (!mounted || stoppedRef.current) return;
      if (runningRef.current) return;

      runningRef.current = true;
      abortRef.current = new AbortController();

      try {
        const u = await refreshUser();
        // if conditionToStop becomes true, stop polling
        if (conditionToStop(u)) {
          stoppedRef.current = true;
          return;
        }
        // else increase backoff with jitter
        intervalRef.current = Math.min(
          maxIntervalMs,
          Math.round(intervalRef.current * (1.5 + Math.random() * 0.5))
        );
      } catch (err) {
        // on error, increase backoff but keep polling
        intervalRef.current = Math.min(maxIntervalMs, intervalRef.current * 2);
      } finally {
        runningRef.current = false;
      }

      if (!stoppedRef.current && mounted) {
        setTimeout(tick, intervalRef.current);
      }
    }

    // start - optionally run immediate refresh
    if (immediate) void tick();
    else setTimeout(tick, intervalRef.current);

    return () => {
      mounted = false;
      stoppedRef.current = true;
      runningRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [enabled, refreshUser, conditionToStop, initialIntervalMs, maxIntervalMs, immediate]);
}
