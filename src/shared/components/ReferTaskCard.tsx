import { CircularProgress } from "@heroui/react";
import { Link } from "react-router";

export default function ReferTaskCard() {
  return (
    <div className="border-1 border-zinc-300 rounded-2xl p-4 bg-white shadow-sm space-y-2">
      <div>
        <div className="flex justify-between gap-4">
          <div className="text-sm">
            <p>
              <span className="font-medium">Refer & Earn Task</span>
            </p>
            <p>
              <span className="font-medium">Task Type:</span> Refer & Earn
            </p>
          </div>

          <p className="text-lg font-semibold">₦500</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
          Available
        </span>

        <CircularProgress
          color="success"
          formatOptions={{ style: "percent" }}
          showValueLabel
          size="sm"
          value={50} // example completion percentage
        />

        <Link
          to={`/refer-and-earn`} // static id
          className="h-8 w-8 rounded-full inline-flex items-center justify-center border-1 border-zinc-800 text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          <span style={{ fontSize: 14 }} className="material-icons-outlined">
            north_east
          </span>
        </Link>
      </div>
    </div>
  );
}
