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
    <div className="min-h-full p-2 md:p-4 grid grid-cols-1 md:grid-cols-[1fr_214px] gap-4">
      <div className="bg-white shadow-md px-4 py-6 md:px-6 md:py-8 space-y-6 overflow-hidden min-h-full">
        <div className="flex gap-3 items-start">
          <Link to="/advertise" className="mt-1">
            <ArrowLeft />
          </Link>
          <div className="space-y-1 truncate">
            <h1 className="text-lg md:text-xl font-medium truncate">All Social Tasks</h1>
            <p className="text-xs md:text-sm text-zinc-900 truncate">
              Track status and earnings from your completed tasks.
            </p>
          </div>
        </div>

        {/* Category Filter Buttons */}
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
                  "px-4 py-2 rounded-lg flex flex-col gap-1 flex-1 min-w-[80px] border border-gray-300 text-gray-700 font-medium text-sm text-left truncate",
                  {
                    "bg-primary/10 text-primary border-gray-300": category === cat.key,
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

        {/* Tasks List */}
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
    <div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col md:flex-row gap-4">
      {/* Platform Icon */}
      <img
        src={platformsImgMap[(props.platforms as string)?.toLowerCase()]}
        alt={(props.platforms as string)?.toLowerCase()}
        className="w-10 h-10 flex-shrink-0 mt-1"
      />

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-800 truncate">{props.title}</h3>
        <p className="text-xs text-gray-600 mt-1 truncate">
          Earning: <span className="font-medium text-gray-800">₦20.00</span> per post engagement
        </p>
        <p className="text-xs text-gray-600 mt-1 truncate">
          Budget: <span className="font-medium text-gray-800">₦{props.estimated_cost ?? "0"}</span>
        </p>
        {props.link && (
          <p className="text-xs text-gray-600 mt-1 truncate">
            Your Link:{" "}
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline truncate"
              title={props.link}
            >
              {props.link}
            </a>
          </p>
        )}
      </div>

      {/* Status & Date */}
      <div className="flex flex-col items-end justify-between gap-1 flex-shrink-0">
        <span className="text-xs uppercase truncate">{props.admin_approval_status}</span>
        <span className="text-xs text-gray-500 truncate">{new Date(props.created_at).toLocaleString()}</span>
        <Link
          to={`/advertise/advert-task-performance/${props.id}`}
          className="mt-2 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 truncate text-center"
        >
          Track Your Advert Performance
        </Link>
      </div>
    </div>
  );
}
