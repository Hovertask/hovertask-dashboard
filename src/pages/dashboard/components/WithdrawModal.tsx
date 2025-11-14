import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import getAuthorization from "../../../utils/getAuthorization";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";

interface WithdrawModalProps {
  show: boolean;
  onClose: () => void;
  balance?: number;
}

export default function WithdrawModal({ show, onClose, balance }: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [banksLoading, setBanksLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accountVerified, setAccountVerified] = useState<boolean>(false);

  // Mask card/account numbers for display
  const maskCard = (num: string) => {
    const digits = String(num || "").replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return `**** **** **** ${digits.slice(-4)}`;
  };

  // Reset modal state when closed
  useEffect(() => {
    if (!show) {
      setAmount("");
      setSelectedBankCode("");
      setAccountNumber("");
      setAccountName("");
      setBankName("");
      setAccountVerified(false);
    }
  }, [show]);

  // Fetch banks & user info when modal opens
  useEffect(() => {
    if (!show) return;
    let ignore = false;

    const fetchBanks = async () => {
      setBanksLoading(true);
      try {
        const res = await fetch(`${apiEndpointBaseURL.replace(/\/$/, "")}/banks`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (!ignore && data.status && Array.isArray(data.data)) setBanks(data.data);
      } catch (err) {
        console.error("Error fetching banks", err);
      } finally {
        setBanksLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiEndpointBaseURL}/dashboard/user`, {
          headers: { Authorization: getAuthorization(), Accept: "application/json" },
        });
        const data = await res.json();
        if (data.user) {
          setAccountName(data.user.account_name || data.user.name || "");
          if (data.user.account_number) setAccountNumber(String(data.user.account_number));
          if (data.user.bank_code) setSelectedBankCode(String(data.user.bank_code));
          if (data.user.bank_name) setBankName(String(data.user.bank_name));
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchBanks();
    fetchUser();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      ignore = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [show, onClose]);

  const withdrawUrl = () => {
    const base = apiEndpointBaseURL.replace(/\/$/, "");
    return base.endsWith("/v1") ? `${base}/withdraw` : `${base}/v1/withdraw`;
  };

  const handleVerifyAccount = async () => {
    if (!selectedBankCode) return alert("Choose a bank first");
    if (!/^[0-9]{9,12}$/.test(accountNumber)) return alert("Enter a valid account number");

    setVerifying(true);
    try {
      const res = await fetch(`${apiEndpointBaseURL}/resolve-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthorization(),
        },
        body: JSON.stringify({ bank_code: selectedBankCode, account_number: accountNumber }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setAccountName(data.data.account_name || accountName);
        setAccountVerified(true);
        setBankName(banks.find(b => b.code === selectedBankCode)?.name || bankName);
        alert(`Account verified: ${data.data.account_name}`);
      } else {
        alert("Could not resolve account: " + (data.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error(err);
      alert("Error resolving account");
    } finally {
      setVerifying(false);
    }
  };

  const handleContinue = async () => {
    const minWithdrawal = 5000;
    if (!amount || Number(amount) < minWithdrawal) return alert(`Minimum withdrawal is ₦${minWithdrawal}`);
    if (!selectedBankCode) return alert("Select a bank");
    if (!/^[0-9]{9,12}$/.test(accountNumber)) return alert("Invalid account number");

    setLoading(true);
    try {
      const res = await fetch(withdrawUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthorization(),
        },
        body: JSON.stringify({
          amount: Number(amount),
          account_number: accountNumber,
          bank_code: selectedBankCode,
          account_name: accountName,
        }),
      });
      const data = await res.json();
      if (data.status) {
        alert("Withdrawal initiated successfully!");
        onClose();
      } else {
        alert("Failed: " + (data.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl rounded-2xl p-6 md:p-8 bg-white shadow-2xl">
        <button
          className="absolute right-4 top-4 text-xl rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-[18px] font-medium mb-4 flex items-center gap-2">
          <Wallet size={18} /> Withdraw from your wallet
        </h3>

        <p className="text-sm mb-2">Available Balance: ₦{balance?.toLocaleString()}</p>

        <div className="space-y-3">
          <label className="text-sm">Choose bank</label>
          {banksLoading ? (
            <p className="text-gray-500 text-sm">Loading banks...</p>
          ) : (
            <select
              value={selectedBankCode}
              onChange={(e) => { setSelectedBankCode(e.target.value); setAccountVerified(false); }}
              className="w-full rounded-lg p-2 border border-zinc-300"
            >
              <option value="">-- Select bank --</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Account number"
            value={accountNumber}
            onChange={(e) => { setAccountNumber(e.target.value); setAccountVerified(false); }}
            className="rounded-lg p-2 border border-zinc-300 w-full"
          />

          <button
            type="button"
            onClick={handleVerifyAccount}
            disabled={verifying || banksLoading}
            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Verify account"}
          </button>

          {selectedBankCode && (
            <p className="text-sm text-gray-600">
              Bank: {bankName || banks.find(b => b.code === selectedBankCode)?.name} | 
              Account: {maskCard(accountNumber)}
            </p>
          )}

          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full rounded-lg p-2 border border-zinc-300 mt-2"
          />

          {/* Minimum withdrawal notice */}
          <p className="text-red-600 font-medium mt-2">
            Minimum withdrawal: ₦5,000
          </p>

          <div className="flex gap-4 mt-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300"
            />
            <button
              onClick={handleContinue}
              disabled={!accountVerified || loading}
              className="px-6 py-3 rounded-full bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
