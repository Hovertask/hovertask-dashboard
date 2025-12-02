import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../../shared/components/Loading";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import EmptyMapErr from "../../shared/components/EmptyMapErr";
import cn from "../../utils/cn";

export default function AdvertTasksHistoryPage() {
  const [tasks, setTasks] = useState<any[]>();
  const [category, setCategory] = useState("success");
  const [categoryTasks, setCategoryTasks] = useState<any[]>();

  const getAuthUSerTasks = useCallback(async () => {
    try {
      const response = await fetch(`${apiEndpointBaseURL}/advertise/authuserads`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) return setTimeout(getAuthUSerTasks, 3000);

      setTasks((await response.json()).data);
    } catch {
      setTimeout(getAuthUSerTasks, 3000);
    }
  }, []);

  useEffect(() => {
    getAuthUSerTasks();
  }, [getAuthUSerTasks]);

  useEffect(() => {
    if (tasks) {
      setCategoryTasks(tasks.filter((task) => task.status === category));
    }
  }, [tasks, category]);

  return categoryTasks ? (
    <div className="min-h-full p-2 md:p-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
      <div className="bg-white shadow-md px-4 py-6 md:px-6 md:py-8 space-y-6 overflow-hidden min-h-full rounded-xl">

        {/* Header */}
        <div className="flex gap-3 items-start">
          <Link to="/advertise" className="mt-1 hover:opacity-80 transition">
            <ArrowLeft />
          </Link>
          <div className="space-y-1 truncate">
            <h1 className="text-lg md:text-xl font-semibold truncate">All Advert Tasks</h1>
            <p className="text-xs md:text-sm text-zinc-900 truncate">
              Track your advert performance and approval status.
            </p>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-gray-200 shadow-sm bg-white">
          {[
            { key: "pending", label: "Pending" },
            { key: "in_review", label: "In Review" },
            { key: "failed", label: "Failed" },
            { key: "success", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map((cat) => {
            const count = tasks?.filter((t) => t.status === cat.key)?.length || 0;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "px-4 py-2 rounded-lg flex flex-col gap-1 flex-1 min-w-[80px] border border-gray-300 text-gray-700 font-medium text-sm text-left truncate transition-all duration-200 hover:bg-gray-50 active:scale-[0.97]",
                  {
                    "bg-blue-50 text-blue-600 border-blue-300 shadow-sm":
                      category === cat.key,
                  }
                )}
                title={`${cat.label} (${count})`}
              >
                <span className="text-sm font-semibold">{count}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        <hr className="border-dashed" />

        {/* Tasks */}
        <div className="space-y-3">
          {categoryTasks.length ? (
            categoryTasks.map((task) => <TaskCard key={task.id} {...task} />)
          ) : (
            <EmptyMapErr
              buttonInnerText="Reload"
              description="No tasks available for this category"
              onButtonClick={getAuthUSerTasks}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading fixed />
  );
}

function TaskCard(props: any) {
  const platformsImgMap: { [k: string]: string } = {
    x: "/images/hugeicons_new-twitter.png",
    tiktok: "/images/logos_tiktok-icon.png",
    facebook: "/images/devicon_facebook.png",
    instagram: "/images/skill-icons_instagram.png",
    whatsapp: "/images/logos_whatsapp-icon.png",
  };

  return (
    <div
      className="
        bg-white border rounded-2xl p-4 shadow-sm 
        hover:shadow-md hover:scale-[1.01] transition-all duration-200 
        flex flex-col gap-4
      "
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <img
          src={platformsImgMap[(props.platforms as string)?.toLowerCase()]}
          alt="platform"
          className="w-10 h-10 rounded-xl bg-gray-100 p-2"
        />

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{props.title}</h3>

          <p className="text-xs text-gray-600 mt-1">
            Earning: <span className="font-semibold">₦20.00</span> per impression
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Budget:{" "}
            <span className="font-semibold">₦{props.estimated_cost ?? "0"}</span>
          </p>

          {props.link && (
            <p className="text-xs text-gray-600 mt-1 truncate">
              Your Link:{" "}
              <a
                href={props.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline truncate"
              >
                {props.link}
              </a>
            </p>
          )}
        </div>

        {/* Status (desktop) */}
        <div className="hidden md:flex flex-col items-end gap-1 text-xs">
          <span
            className={`
              px-2 py-0.5 rounded-full text-white text-[10px] font-semibold
              ${
                props.admin_approval_status === "success"
                  ? "bg-green-500"
                  : props.admin_approval_status === "pending"
                  ? "bg-yellow-500"
                  : props.admin_approval_status === "in_review"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }
            `}
          >
            {props.admin_approval_status.replace("_", " ").toUpperCase()}
          </span>

          <span className="text-gray-500 text-[11px]">
            {new Date(props.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Mobile status */}
      <div className="md:hidden flex items-center justify-between">
        <span
          className={`
            px-2 py-0.5 rounded-full text-white text-[10px] font-semibold
            ${
              props.admin_approval_status === "success"
                ? "bg-green-500"
                : props.admin_approval_status === "pending"
                ? "bg-yellow-500"
                : props.admin_approval_status === "in_review"
                ? "bg-blue-500"
                : "bg-red-500"
            }
          `}
        >
          {props.admin_approval_status.replace("_", " ").toUpperCase()}
        </span>

        <span className="text-gray-500 text-[11px]">
          {new Date(props.created_at).toLocaleString()}
        </span>
      </div>

      {/* Action Button */}
      <Link
        to={`/advertise/advert-task-performance/${props.id}`}
        className="
          w-full md:w-auto text-center
          px-4 py-2 text-xs bg-blue-600 text-white rounded-lg shadow-sm 
          hover:bg-blue-700 hover:shadow-md active:scale-[0.97]
          transition-all duration-200
        "
      >
        Track Your Advert Performance
      </Link>
    </div>
  );
}
