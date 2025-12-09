import { CircularProgress } from "@heroui/react";
import { Link } from "react-router";

export default function ResellerTaskCard() {
  return (
    <div className="border-1 border-zinc-300 rounded-2xl p-4 bg-white shadow-sm space-y-2">
      <div>
        <div className="flex justify-between gap-4">
          <div className="text-sm">
            <p className="font-medium text-primary">
              Reseller Growth Task
            </p>

            <p className="text-xs text-zinc-600 leading-tight">
              Boost your earnings by completing simple reseller milestones.
            </p>

            <p className="mt-1">
              <span className="font-medium">Task Type:</span>{" "}
              Resell Products & Earn Commission
            </p>
          </div>

          <p className="text-lg font-semibold text-primary">₦500 Bonus</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="px-2 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
          Active for Resellers
        </span>

        <CircularProgress
          color="primary"
          formatOptions={{ style: "percent" }}
          showValueLabel
          size="sm"
          value={15} // example completion percentage
        />

        <Link
          to={`/earn/resell`} 
          className="h-8 w-8 rounded-full inline-flex items-center justify-center border-1 border-primary text-primary transition-colors hover:bg-primary/10"
        >
          <span style={{ fontSize: 14 }} className="material-icons-outlined">
            north_east
          </span>
        </Link>
      </div>
    </div>
  );
}
