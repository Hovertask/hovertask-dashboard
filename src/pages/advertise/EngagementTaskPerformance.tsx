import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Link, useParams } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";

export default function EngagementTaskPerformancePage() {
  const { id } = useParams();
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(
          `${apiEndpointBaseURL}/tasks/show-task-perfrmance/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (data.status) setTask(data.data);
      } catch (error) {
        console.error("Error fetching task", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!task) return <p className="p-6 text-center">Task not found.</p>;

  return (
    <div className="min-h-full p-2 md:p-4 grid grid-cols-1 md:grid-cols-[1fr_214px] gap-4">
      <Toaster position="top-right" />
      <div className="bg-white shadow-md px-4 py-6 md:px-6 md:py-8 space-y-6 overflow-hidden min-h-full">
        <div className="flex items-start gap-3 md:gap-4">
          <Link to="/advertise" className="mt-1">
            <ArrowLeft />
          </Link>
          <div className="space-y-1 truncate">
            <h1 className="text-lg md:text-xl font-medium truncate">
              Track Your Task Performance
            </h1>
            <p className="text-xs md:text-sm text-zinc-900 truncate">
              Monitor the progress of your engagement tasks in real time and make adjustments as needed.
            </p>
          </div>
        </div>

        <TaskPerformance task={task} setTask={setTask} />
      </div>
    </div>
  );
}

function TaskPerformance({
  task,
  setTask,
}: {
  task: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [selectedProof, setSelectedProof] = useState<{ screenshot: string; link?: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; status: string } | null>(null);

  const handleStatusUpdate = async (participantId: number, newStatus: string) => {
    try {
      const res = await fetch(`${apiEndpointBaseURL}/engagement/participants/${participantId}/status`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.status) {
        toast.success(`Participant ${newStatus} successfully!`);

        setTask((prev: any) => {
          const updatedParticipants = prev.participants.map((p: any) =>
            p.id === participantId ? { ...p, status: newStatus } : p
          );

          const updatedStats = { ...prev.stats };
          if (newStatus === "accepted") {
            updatedStats.accepted += 1;
            if (updatedStats.pending > 0) updatedStats.pending -= 1;
          } else if (newStatus === "rejected") {
            updatedStats.rejected += 1;
            if (updatedStats.pending > 0) updatedStats.pending -= 1;
          }

          const amountPaid = Number(prev.amount_paid) || 0;
          const payout = Number(prev.payment_per_task) || 0;
          const newBudgetSpent = newStatus === "accepted" ? amountPaid - payout : amountPaid;

          return {
            ...prev,
            participants: updatedParticipants,
            stats: updatedStats,
            BudgetSpent: newBudgetSpent,
          };
        });
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update participant", err);
      toast.error("An error occurred while updating status");
    } finally {
      setConfirmAction(null);
    }
  };

  const filteredParticipants =
    filter === "all"
      ? task.participants
      : task.participants.filter((p: any) => p.status === filter);

  const amountPaid = Number(task.amount_paid) || 0;
  const BudgetSpent = Number(task.stats.BudgetSpent) || 0;
  const payoutPer = Number(task.payment_per_task) || 0;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between border p-4 rounded-lg gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 truncate">{task.title}</h3>
          <p className="text-xs text-gray-600 mt-1 truncate">
            Earnings: <span className="text-green-600 font-medium">₦{payoutPer.toFixed(2)}</span> per engagement
          </p>
          <p className="text-xs text-gray-600 mt-1 truncate">
            Budget: <span className="font-medium">₦{amountPaid.toLocaleString()}</span> &nbsp;|&nbsp; Your Link:{" "}
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline truncate"
              title={task.link}
            >
              {task.link}
            </a>
          </p>
          <p className="text-xs text-gray-600 mt-1 truncate">
            Budget Spent: <span className="text-green-600 font-medium">₦{BudgetSpent.toLocaleString()}</span>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className={`text-xs font-medium ${
              task.status === "success" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {task.status?.toUpperCase()}
          </span>
          <p className="text-[10px] text-gray-400">{new Date(task.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm">
        {[
          { label: "All", value: task.stats.total_participants, key: "all" },
          { label: "Pending", value: task.stats.pending || 0, key: "pending" },
          { label: "Accepted", value: task.stats.accepted || 0, key: "accepted" },
          { label: "Rejected", value: task.stats.rejected || 0, key: "rejected" },
          { label: "Completion Rate", value: task.stats.completion_percentage || 0, key: "rate" },
        ].map((stat) => (
          <div
            key={stat.key}
            onClick={() => stat.key !== "rate" && setFilter(stat.key as any)}
            className={`cursor-pointer bg-gray-50 p-2 md:p-3 rounded border truncate ${
              filter === stat.key ? "border-blue-500" : ""
            }`}
            title={`${stat.value}`}
          >
            <p className="font-medium text-lg md:text-xl text-gray-800 truncate">{stat.value}</p>
            <p className="text-gray-500 text-xs truncate">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">
          {filter === "all" ? "All Participants" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Participants`}
        </h4>
        {filteredParticipants.length > 0 ? (
          <div className="space-y-3">
            {filteredParticipants.map((p: any) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {p.name} <span className="text-gray-500">{p.handle}</span>
                  </p>
                  <button
                    onClick={() => setSelectedProof({ screenshot: p.screenshot_path, link: p.proof_link })}
                    className="text-xs text-blue-600 underline truncate"
                  >
                    View Proof
                  </button>
                  <p className="text-xs text-gray-500 truncate">{new Date(p.submitted_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  {p.status === "pending" ? (
                    <>
                      <button
                        onClick={() => setConfirmAction({ id: p.id, status: "accepted" })}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex-shrink-0"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: p.id, status: "rejected" })}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded flex-shrink-0"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2 py-1 text-xs rounded flex-shrink-0 ${
                        p.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No {filter} participants.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 text-center">
            <h3 className="text-lg font-medium mb-3">
              Confirm {confirmAction.status === "accepted" ? "Acceptance" : "Rejection"}
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to <span className="font-semibold">{confirmAction.status}</span> this participant?
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(confirmAction.id, confirmAction.status)}
                className={`px-4 py-2 text-sm rounded text-white ${
                  confirmAction.status === "accepted" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-lg w-full p-4 relative">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={18} />
            </button>

            <img
              src={selectedProof.screenshot}
              alt="Proof Screenshot"
              className="w-full rounded-lg object-contain"
            />

            {selectedProof.link && (
              <p className="mt-3 text-center truncate">
                <a
                  href={selectedProof.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm truncate"
                  title={selectedProof.link}
                >
                  View Proof Link
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// ------------------ End of TaskPerformance ------------------