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
        const res = await fetch(`${apiEndpointBaseURL}/show-task-perfrmance/${id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        });
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!task) return <p className="p-6">Task not found.</p>;

  return (
    <div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
      <Toaster position="top-right" />
      <div className="bg-white shadow-md px-4 py-8 space-y-6 overflow-hidden min-h-full">
        <div className="flex gap-4 flex-1">
          <Link to="/advertise">
            <ArrowLeft />
          </Link>
          <div className="space-y-2">
            <h1 className="text-xl font-medium">Track Your Task Performance</h1>
            <p className="text-sm text-zinc-900">
              Monitor the progress of your engagement tasks in real time and
              make adjustments as needed.
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
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
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

          // safely convert numeric values
          const updatedStats = { ...prev.stats };
          if (newStatus === "accepted") {
            updatedStats.accepted += 1;
            if (updatedStats.pending > 0) updatedStats.pending -= 1;
          } else if (newStatus === "rejected") {
            updatedStats.rejected += 1;
            if (updatedStats.pending > 0) updatedStats.pending -= 1;
          }

          const amountPaid = Number(prev.amount_paid) || 0;
          //const totalParticipants = Number(prev.stats.total_participants) || 1;
          const payout = Number(prev.payment_per_task );

          const newBudgetSpent =
            newStatus === "accepted" ? amountPaid - payout : amountPaid;

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

  const payoutPer = Number(task.payment_per_task );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-start border p-4 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-1">{task.title}</h3>
          <p className="text-xs text-gray-600 mb-1">
            Earnings:{" "}
            <span className="text-green-600 font-medium">
              ₦{payoutPer.toFixed(2)}
            </span>{" "}
            per engagement.
          </p>
          <p className="text-xs text-gray-600">
            Budget:{" "}
            <span className="font-medium">₦{amountPaid.toFixed(2)}</span> &nbsp; | &nbsp; Your
            Link:{" "}
            <a
              href={task.link}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {task.link}
            </a>
          </p>
          <p className="text-xs text-gray-600 mb-1">
            Budget Spent:{" "}
            <span className="text-green-600 font-medium">
              ₦{BudgetSpent.toFixed(2)}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              ₦{Number(amountPaid || 0).toLocaleString()}
            </span>
            
          </p>
          
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-medium ${
              task.status === "success" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {task.status?.toUpperCase()}
          </span>
          <p className="text-[10px] text-gray-400">
            {new Date(task.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 text-center text-sm">
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
            className={`cursor-pointer bg-gray-50 p-3 rounded border ${
              filter === stat.key ? "border-blue-500" : ""
            }`}
          >
            <p className="font-medium text-lg text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Participants List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {filter === "all"
            ? "All Participants"
            : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Participants`}
        </h4>

        {filteredParticipants.length > 0 ? (
          <div className="space-y-3">
            {filteredParticipants.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {p.name} <span className="text-gray-500">{p.handle}</span>
                  </p>
                  <button
                    onClick={() => setSelectedProof(p.proof_link)}
                    className="text-xs text-blue-600 underline"
                  >
                    View Proof
                  </button>
                  <p className="text-xs text-gray-500">
                    {new Date(p.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {p.status === "pending" ? (
                    <>
                      <button
                        onClick={() => setConfirmAction({ id: p.id, status: "accepted" })}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: p.id, status: "rejected" })}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2 py-1 text-xs rounded ${
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 text-center">
            <h3 className="text-lg font-medium mb-3">
              Confirm {confirmAction.status === "accepted" ? "Acceptance" : "Rejection"}
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to{" "}
              <span className="font-semibold">{confirmAction.status}</span> this participant?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(confirmAction.id, confirmAction.status)
                }
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-4 relative">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <img
              src={selectedProof}
              alt="Proof Screenshot"
              className="w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
