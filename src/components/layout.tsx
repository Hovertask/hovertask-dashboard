// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom"; // removed useLocation
import Header from "./Header";
import SideNav from "./SideNav";
import { useEffect, useMemo, useState } from "react";
import getAuthUser from "../utils/getAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/slices/auth";
import Loading from "../shared/components/Loading";
import RequirementModal from "./RequirementModal";
import useRequirementPoll from "../hooks/useRequirementPoll";
import type { AuthUserDTO } from "../../types";

export default function RootLayout() {
  const dispatch = useDispatch();

  const user = useSelector<{ auth: { value: AuthUserDTO | null } }, AuthUserDTO | null>(
    (s) => s.auth.value ?? null
  );

  const [initialLoading, setInitialLoading] = useState(!user);

  // Fetch user initially (with retry)
  useEffect(() => {
    let mounted = true;
    async function fetchUserOnce() {
      try {
        const u = await getAuthUser();
        if (!mounted) return;
        dispatch(setAuthUser(u));
      } catch {
        setTimeout(() => {
          if (mounted) fetchUserOnce();
        }, 3000);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    }

    if (!user) fetchUserOnce();
    else setInitialLoading(false);

    return () => {
      mounted = false;
    };
  }, [dispatch, user]);

  // Compute requirements and unmet steps with dependencies
  const requirements = useMemo(() => {
    if (!user) return { unmet: [], total: 0, completed: 0 };

    const checks: { key: string; label: string; ok: boolean; route: string; dependency?: string }[] = [
      { key: "email", label: "Verify your email", ok: Boolean(user.email_verified_at), route: "/VerifyEmail" },
      { key: "membership", label: "Become a member", ok: Boolean(user.is_member), route: "/become-a-member", dependency: "email" },
    ];

    // Only add advertise step if membership is done, else mark as unmet with dependency
    if (user.is_member) {
      checks.push({
        key: "advertise",
        label: "Create your first advert or task",
        ok: !(user.advertise_count === 0 && user.task_count === 0),
        route: "/advertise",
        dependency: "membership",
      });
    } else {
      checks.push({
        key: "advertise",
        label: "Create your first advert or task",
        ok: false,
        route: "/advertise",
        dependency: "membership",
      });
    }

    const unmet = checks.filter((c) => !c.ok).map((c) => {
      if (c.dependency) {
        const depStep = checks.find((s) => s.key === c.dependency);
        if (depStep && !depStep.ok) {
          return { ...c, label: `${depStep.label} must be completed first` };
        }
      }
      return c;
    });

    const completed = checks.length - unmet.length;
    return { checks, unmet, total: checks.length, completed };
  }, [user]);

  // Polling hook to refresh user automatically
  useRequirementPoll({
    enabled: Boolean(user),
    refreshUser: async () => {
      const refreshed = await getAuthUser();
      dispatch(setAuthUser(refreshed));
      return refreshed;
    },
    conditionToStop: (u) => {
      if (!u) return false;
      return Boolean(
        u.email_verified_at &&
          u.is_member &&
          !(u.advertise_count === 0 && u.task_count === 0)
      );
    },
  });

  if (initialLoading) return <Loading fixed />;

  return (
    <>
      <Header />
      <div className="bg-container">
        <div className="grid grid-cols-1 mobile:grid-cols-[243px_1fr] max-w-[1181px] mx-auto mobile:px-4 gap-4">
          <aside className="max-mobile:hidden">
            <SideNav />
          </aside>

          <main className="overflow-hidden min-h-screen relative">
            <Outlet />

            {/* Show modal if there are unmet steps */}
            {requirements.unmet.length > 0 && (
              <RequirementModal
                unmetSteps={requirements.unmet}
                totalSteps={requirements.total}
                completedSteps={requirements.completed}
                onManualRefresh={async () => {
                  const u = await getAuthUser();
                  dispatch(setAuthUser(u));
                }}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
