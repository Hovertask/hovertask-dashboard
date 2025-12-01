// src/layouts/RequirementModal.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Check = { key: string; label: string; ok?: boolean; route?: string };

export default function RequirementModal({
  unmetSteps,
  totalSteps,
  completedSteps,
  onManualRefresh,
}: {
  unmetSteps: Check[];
  totalSteps: number;
  completedSteps: number;
  onManualRefresh: () => Promise<void>;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const percent = Math.round((completedSteps / Math.max(1, totalSteps)) * 100);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await onManualRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="requirements-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-xl">
        <h2 id="requirements-title" className="text-xl font-semibold mb-3 text-center">
          You must complete these steps to access this page
        </h2>

        <div className="mb-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{ width: `${percent}%`, background: "linear-gradient(90deg,#2563eb,#06b6d4)" }}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {completedSteps}/{totalSteps} steps complete — {percent}%
          </div>
        </div>

        <ul className="mb-4 space-y-2">
          {unmetSteps.map((s) => (
            <li key={s.key} className="flex items-center justify-between border p-3 rounded">
              <div>
                <div className="font-medium">{s.label}</div>
                {s.route && <div className="text-xs text-gray-500">Tap action to go to: {s.route}</div>}
              </div>

              {s.route && (
                <button
                  onClick={() => navigate(s.route!)}
                  className="px-3 py-1 text-sm rounded shadow-sm bg-white border hover:bg-gray-50"
                >
                  Go
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh status"}
          </button>

          <button
            onClick={() => navigate("/support")}
            className="py-2 px-3 rounded-md border flex-shrink-0"
          >
            Need help
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Tip: After completing a step, press Refresh or the status will auto-update once the server confirms the change.
        </div>
      </div>
    </div>
  );
}
