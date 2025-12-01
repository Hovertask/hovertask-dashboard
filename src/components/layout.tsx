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

export default function RootLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

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

  // Compute requirements and unmet steps
  const requirements = useMemo(() => {
    if (!user) return { checks: [], unmet: [], total: 0, completed: 0 };

    const checks: { key: string; label: string; ok: boolean; route: string; dependency?: string }[] = [
      { key: "email", label: "Verify your email", ok: Boolean(user.email_verified_at), route: "/VerifyEmail" },
      { key: "membership", label: "Become a member", ok: Boolean(user.is_member), route: "/become-a-member", dependency: "email" },
      { 
        key: "advertise", 
        label: "Create your first advert or task", 
        ok: !(user.advertise_count === 0 && user.task_count === 0), 
        route: "/advertise", 
        dependency: "membership" 
      },
    ];

    const unmet = checks.map(c => {
      if (!c.ok && c.dependency) {
        const depStep = checks.find(s => s.key === c.dependency);
        if (depStep && !depStep.ok) {
          return { ...c, label: `${depStep.label} must be completed first` };
        }
      }
      return c;
    }).filter(c => !c.ok);

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

  // Determine if modal should show on the current page
  const shouldShowModal = (() => {
    if (!user) return false;
    if (excludedPages.includes(location.pathname)) return false;

    const emailStep = requirements.checks.find(c => c.key === "email");
    const membershipStep = requirements.checks.find(c => c.key === "membership");

    // Email not verified: show modal on membership & advertise pages
    if (emailStep && !emailStep.ok) {
      return ["/become-a-member", "/advertise"].includes(location.pathname);
    }

    // Email verified, membership not done: show modal only on advertise page
    if (membershipStep && !membershipStep.ok) {
      return location.pathname === "/advertise";
    }

    return false; // otherwise don't show
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
