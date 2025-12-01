// src/layouts/RootLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
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

type Check = {
  key: string;
  label: string;
  ok: boolean;
  route: string;
  dependency?: string;
};

export default function RootLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

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

  // Compute requirements and unmet steps (always return checks)
  const requirements = useMemo(() => {
    if (!user) return { checks: [] as Check[], unmet: [] as Check[], total: 0, completed: 0 };

    const checks: Check[] = [
      { key: "email", label: "Verify your email", ok: Boolean(user.email_verified_at), route: "/VerifyEmail" },
      { key: "membership", label: "Become a member", ok: Boolean(user.is_member), route: "/become-a-member", dependency: "email" },
      { key: "advertise", label: "Create your first advert or task", ok: !(user.advertise_count === 0 && user.task_count === 0), route: "/advertise", dependency: "membership" },
    ];

    // If a step is unmet but its dependency is unmet, annotate label (optional)
    const unmet = checks
      .map((c) => {
        if (!c.ok && c.dependency) {
          const dep = checks.find((s) => s.key === c.dependency);
          if (dep && !dep.ok) {
            return { ...c, label: `${dep.label} must be completed first` };
          }
        }
        return c;
      })
      .filter((c) => !c.ok);

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

  // Pages where modal should never appear
  const excludedPages = ["/choose-online-payment-method", "/fund-wallet", "/payment/callback"];

  // Final decision: should modal be shown on the current page?
  const shouldShowModal = (() => {
    // no user => don't show
    if (!user) return false;

    // explicitly excluded pages => don't show
    if (excludedPages.includes(path)) return false;

    // no unmet requirements => don't show
    if (!requirements.unmet || requirements.unmet.length === 0) return false;

    // If current path is the route for an unmet step, allow access ONLY if
    // that step's dependencies are satisfied (so user can complete it).
    // Otherwise (current path not a step route OR dependency not satisfied),
    // the modal should show.
    // Loop through unmet steps and check:
    for (const step of requirements.unmet) {
      if (step.route === path) {
        // If the step has no dependency -> allow (hide modal) so user can complete it.
        if (!step.dependency) return false;

        // If dependency exists, check that dependency step is OK
        const dep = requirements.checks.find((c) => c.key === step.dependency);
        if (dep && dep.ok) {
          // dependency satisfied -> allow access to this step page
          return false;
        } else {
          // dependency not satisfied -> block (show modal)
          return true;
        }
      }
    }

    // If current path is NOT the route for any unmet step, show modal
    return true;
  })();

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

            {shouldShowModal && (
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
