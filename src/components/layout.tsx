// src/layouts/RootLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideNav from "./SideNav";
import { useMemo } from "react";
import getAuthUser from "../utils/getAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/slices/auth";
//import Loading from "../shared/components/Loading";
import RequirementModal from "./RequirementModal";
//import useRequirementPoll from "../hooks/useRequirementPoll";
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

  //const [initialLoading, setInitialLoading] = useState(!user);

  // Compute requirements and unmet steps
  const requirements = useMemo(() => {
    if (!user) return { checks: [] as Check[], unmet: [] as Check[], total: 0, completed: 0 };

    const checks: Check[] = [
      { key: "email", label: "Verify your email", ok: Boolean(user.email_verified_at), route: "/VerifyEmail" },
      { key: "membership", label: "Become a member", ok: Boolean(user.is_member), route: "/become-a-member", dependency: "email" },
      { key: "advertise", label: "Create your first advert or task", ok: !(user.advertise_count === 0 && user.task_count === 0), route: "/advertise", dependency: "membership" },
    ];

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

  

  // Pages where modal should never appear
  const excludedPages = ["/choose-online-payment-method", "/fund-wallet", "/payment/callback"];

  // Should show modal?
  const shouldShowModal = (() => {
    if (!user) return false;
    if (excludedPages.includes(path)) return false;
    if (!requirements.unmet || requirements.unmet.length === 0) return false;

    for (const step of requirements.unmet) {
      const isStepPage =
        step.key === "advertise"
          ? path.startsWith(step.route) // wildcard support for /advertise/*
          : step.route === path;

      if (isStepPage) {
        if (!step.dependency) return false;

        const dep = requirements.checks.find((c) => c.key === step.dependency);
        if (dep && dep.ok) return false; // dependency satisfied
        else return true; // dependency not satisfied
      }
    }

    return true; // page unrelated to unmet step → show modal
  })();

  //if (initialLoading) return <Loading fixed />;

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
