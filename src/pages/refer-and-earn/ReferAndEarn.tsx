// src/pages/ReferAndEarnPage.tsx  (replace/adjust path to your actual file)
import { ArrowLeft, Copy } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { AuthUserDTO } from "../../../types";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import getAuthorization from "../../utils/getAuthorization";

type ReferredItem = {
  id: number;
  amount: number;
  status: string;
  created_at: string | null;
  referee: {
    id: number;
    fname: string;
    lname: string;
    avatar?: string | null;
    created_at?: string | null;
  } | null;
};

export default function ReferAndEarnPage() {
  const referralCode = useSelector<{ auth: { value: AuthUserDTO } }, string>(
    (state) => state.auth.value.referral_code,
  );
  const refLink = `https://hovertask.com/signup/?ref=${referralCode}`;

  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [paid, setCompleted] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [referred, setReferred] = useState<ReferredItem[]>([]);

  async function copyRefLink() {
    try {
      await window.navigator.clipboard.writeText(refLink);
      toast.success("Copied!");
    } catch {
      toast.error("failed to copy!");
    }
  }

  useEffect(() => {
    let mounted = true;
    async function fetchReferrals() {
      setLoading(true);
      try {
        const res = await fetch(`${apiEndpointBaseURL}/referrals`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
          },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load referrals");
        }

        const d = json.data || {};
        if (!mounted) return;

        setCount(d.count ?? 0);
        setPending(Number(d.pending ?? 0));
        setCompleted(Number(d.paid ?? 0));
        setTotal(Number(d.total ?? (Number(d.pending ?? 0) + Number(d.paid ?? 0))));
        setReferred(Array.isArray(d.referrals) ? d.referrals : []);
      } catch (err: any) {
        console.error("referrals fetch error", err);
        toast.error(err?.message || "Failed to fetch referrals");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchReferrals();
    return () => {
      mounted = false;
    };
  }, [referralCode]);

  return (
    <div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full p-4">
      <div className="bg-white shadow-md space-y-6 overflow-hidden min-h-full rounded-3xl">
        <div className="flex gap-4 flex-1 bg-gradient-to-r from-white via-primary/20 to-white px-4 pt-4 items-center">
          <Link to="/">
            <ArrowLeft />
          </Link>

          <div className="flex items-center justify-center flex-1 max-sm:flex-wrap max-sm:p-4 space-y-4">
            <img
              src="/images/Free_Photo___Happy_mixed_race_friendly_people_embrace_each_other-removebg-preview 1.png"
              alt=""
              className="w-24 h-24 object-cover"
            />
            <h1 className="text-3xl text-center font-medium text-primary">
              Refer & Earn <br /> Big
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="p-4">
            Invite your friends, family, or colleagues to join our platform using your unique referral link.
            Each successful referral puts money into your referral balance.
          </p>

          <div>
            <h3 className="font-medium">How It Works</h3>
            <ol className="list-decimal list-inside">
              <li>Copy your unique referral link.</li>
              <li>Share link across your social media, email, or messaging apps.</li>
              <li>Earn <span className="font-medium">₦500</span> rewards every time someone signs up and completes the required action.</li>
            </ol>
          </div>

          <div className="flex gap-x-4 gap-y-1 flex-wrap items-center">
            <span className="font-medium">My Referral Link:</span>
            <span className="flex p-2 border border-zinc-400 rounded-full gap-4 text-sm items-center">
              <span className="bg-primary/20 p-2 rounded-full text-primary break-words max-w-[320px]">
                {refLink}
              </span>
              <button
                onClick={copyRefLink}
                type="button"
                className="flex gap-2 items-center text-primary transition-all active:scale-95 hover:bg-primary/20 px-2 py-1 rounded-full"
              >
                <Copy size={12} /> Copy
              </button>
            </span>
          </div>

          {/* stats row */}
          <div className="flex gap-x-4 flex-wrap gap-y-2 items-center mt-2">
            <div className="flex flex-col gap-1 bg-slate-200/80 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
              <span className="font-medium">{loading ? "..." : count}</span>
              <small>Referred Users</small>
            </div>

            <div className="flex flex-col gap-1 bg-slate-200/80 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
              <span className="font-medium">₦{loading ? "..." : Number(total).toLocaleString()}</span>
              <small>Total Earnings</small>
            </div>

            <div className="flex flex-col gap-1 bg-yellow-50 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
              <span className="font-medium text-amber-700">₦{loading ? "..." : Number(pending).toLocaleString()}</span>
              <small>Pending Earnings</small>
            </div>

            <div className="flex flex-col gap-1 bg-green-50 border border-zinc-400 w-fit rounded-lg px-4 py-1.5">
              <span className="font-medium text-emerald-700">₦{loading ? "..." : Number(paid).toLocaleString()}</span>
              <small>Completed Earnings</small>
            </div>

            <button
              type="button"
              className="px-4 py-3 rounded-xl text-sm transition-all active:scale-95 bg-primary text-white ml-auto"
              onClick={() => {
                // replace with your withdraw flow
                if (pending <= 0) {
                  toast('No pending earnings to withdraw');
                } else {
                  // navigate to withdraw / wallet page (example)
                  window.location.href = '/wallet/withdraw';
                }
              }}
            >
              Withdraw Earnings
            </button>
          </div>

          {/* referred users list */}
          <div className="mt-4">
            <h4 className="font-medium mb-3">Referred Users</h4>

            {loading ? (
              <p>Loading...</p>
            ) : referred.length === 0 ? (
              <p className="text-zinc-500">You haven't referred anyone yet.</p>
            ) : (
              <ul className="space-y-3">
                {referred.map((r) => (
                  <li key={r.id} className="flex items-center gap-4 bg-white border border-zinc-100 rounded-lg p-3">
                    <img
                      src={r.referee?.avatar || '/images/default-user.png'}
                      alt={`${r.referee?.fname || 'User'}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium truncate">
                            {r.referee ? `${r.referee.fname} ${r.referee.lname}` : '—'}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Joined {r.referee?.created_at ? new Date(r.referee.created_at).toLocaleDateString() : '—'}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-sm ${r.status === 'paid' ? 'text-emerald-700' : (r.status === 'pending' ? 'text-amber-700' : 'text-zinc-600')}`}>
                            {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                          </div>
                          <div className="font-medium">₦{Number(r.amount).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
