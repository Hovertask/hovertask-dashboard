import { Wallet } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import getAuthorization from "../../../utils/getAuthorization";
import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";

export default function BalanceBoard({ balance }: { balance?: number }) {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // New: bank/account fields
  const [banks, setBanks] = useState<Array<{ name: string; code: string }>>([]);
  const [selectedBankCode, setSelectedBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>(""); // user can edit
  const [banksLoading, setBanksLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWithdraw(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fetch banks and user profile once when withdraw modal opens
  useEffect(() => {
    if (!showWithdraw) return;
    let ignore = false;

    async function fetchBanks() {
      setBanksLoading(true);
      try {
        const res = await fetch(`${apiEndpointBaseURL.replace(/\/$/, "")}/banks`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          console.error("Failed to fetch banks", res.status);
          setBanks([]);
          return;
        }
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          if (!ignore) {
            setBanks(data.data);
          }
        } else {
          console.error("Unexpected banks response", data);
        }
      } catch (err) {
        console.error("Error fetching banks", err);
      } finally {
        setBanksLoading(false);
      }
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${apiEndpointBaseURL}/dashboard/user`, {
          headers: { Authorization: getAuthorization(), Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          setAccountName(data.user.name || "");
        } else if (data.name) {
          setAccountName(data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }

    fetchBanks();
    fetchUser();

    return () => {
      ignore = true;
    };
  }, [showWithdraw]);

  const handleOpenWithdraw = (e: React.MouseEvent) => {
    e.preventDefault(); // keep the Link in place but stop navigation
    setShowWithdraw(true);
  };

  // Helper: pick withdraw endpoint (supports apiEndpointBaseURL that may already include /v1)
  const withdrawUrl = () => {
    const base = apiEndpointBaseURL.replace(/\/$/, "");
    if (base.endsWith("/v1")) return `${base}/withdraw`;
    return `${base}/v1/withdraw`;
  };

  const handleVerifyAccount = async () => {
    if (!selectedBankCode) return alert("Choose a bank first");
    if (!/^[0-9]{9,12}$/.test(accountNumber)) return alert("Enter a valid account number");

    setVerifying(true);
    try {
      const res = await fetch(`${apiEndpointBaseURL.replace(/\/$/, "")}/v1/resolve-account`, {
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
        setAccountName(data.data.account_name || data.data?.account_name || accountName);
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
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount");
    }

    if (Number(amount) < 5000) {
      return alert("Minimum withdrawal is ₦5,000");
    }

    if (!selectedBankCode) return alert("Please select a bank");
    if (!/^[0-9]{9,12}$/.test(accountNumber)) return alert("Please enter a valid account number (digits only)");
    if (!accountName || accountName.trim().length < 2) return alert("Please enter the account name");

    setLoading(true);
    try {
      const res = await fetch(withdrawUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: getAuthorization(),
        },
        body: JSON.stringify({
          amount: Number(amount),
          account_number: accountNumber,
          bank_code: selectedBankCode,
          account_name: accountName,
        }),
      });

      console.log("withdraw response:", { status: res.status, url: res.url, redirected: res.redirected });

      if (res.redirected) {
        const text = await res.text().catch(() => "");
        console.error("Withdraw request was redirected. final url:", res.url, "body:", text);
        alert("Server redirected the request. This usually means authentication failed or the API is misconfigured. Check server logs.");
        return;
      }

      const data = await res.json().catch(() => ({ status: false, message: "Invalid JSON response" }));
      if (data.status || data.message === "Withdrawal initiated successfully!") {
        alert("Withdrawal initiated successfully!");
        setShowWithdraw(false);
        setAmount("");
        setAccountNumber("");
        setAccountName("");
        setSelectedBankCode("");
      } else {
        const message = data.message || data.error || JSON.stringify(data);
        alert("Failed: " + message);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };


	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-[18.66px]">Total Balance</span>
			</div>

			<div className="flex items-center gap-12 flex-wrap">
				<div className="text-[34.67px] font-medium">
					₦{balance?.toFixed(2).toLocaleString()}
				</div>
				<div className="flex gap-6 text-sm flex-wrap font-medium">
					<Link
						to="/fund-wallet"
						className="flex items-center gap-2 px-[18.5px] py-[14px] text-white bg-primary rounded-full hover:bg-primary/80 transition-colors"
					>
						<Wallet size={16} /> Fund
					</Link>
					<Link
						to="/withdraw"
						onClick={handleOpenWithdraw}
						className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-full transition-colors hover:bg-primary/10"
					>
						<Wallet size={16} /> Withdraw
					</Link>
				</div>
			</div>

			<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-[#DAE2FF] p-8 rounded-2xl">
				<div className="space-y-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-[13.87px]">Earned</span>
					</div>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Pending</p>
					<p className="text-[20.8px] font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

				<div className="space-y-3 py-2">
					<p className="text-[13.87px]">Spent</p>
					<p className="text-[20.8px] font-medium">
						₦ {balance?.toFixed(2).toLocaleString()}
					</p>
				</div>
			</div>

			{/* Withdraw modal - appears when Withdraw Link is clicked. */}
			{showWithdraw && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* backdrop */}
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowWithdraw(false)}
					/>

					{/* modal card */}
					<div className="relative w-full max-w-3xl rounded-2xl p-6 md:p-8 bg-white shadow-2xl">
						<button
							className="absolute right-4 top-4 text-xl leading-none rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100"
							onClick={() => setShowWithdraw(false)}
						>
							&times;
						</button>

						<h3 className="text-[18px] font-medium mb-4">
							Easily transfer your wallet balance to your bank account
						</h3>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
								<span className="font-medium">2. Bank Details</span>
								<Link to="#" className="ml-auto text-indigo-600 hover:underline" onClick={(e)=>e.preventDefault()}>
									Change
								</Link>
							</div>

							{/* card with bank summary */}
							<div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
								<div className="flex items-center gap-3">
									<span className="inline-block w-9 h-9">
										<svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" className="w-9 h-6">
											<circle cx="12" cy="12" r="7" fill="#EB001B" />
											<circle cx="24" cy="12" r="7" fill="#F79E1B" />
										</svg>
									</span>
								</div>
								<div>
									<div className="font-medium">MasterCard/Visa/Verve Card</div>
									<div className="text-sm text-gray-600">FCMB | Alayande Nurudeen | 6576 3467 **** 0902</div>
								</div>
							</div>

							{/* blue rounded input area */}
							<div className="mt-4 bg-gradient-to-b from-[#EEF2FF] to-[#DCE6FF] p-6 rounded-2xl">
                <p className="text-gray-600 mb-4">Please input the amount you wish to withdraw from your wallet.</p>

                {/* Bank selection & account resolution */}
                <div className="space-y-3 mb-3">
                  <label className="text-sm">Choose bank</label>
                  {banksLoading ? (
                    <p className="text-sm text-gray-500">Loading banks...</p>
                  ) : (
                    <select
                      value={selectedBankCode}
                      onChange={(e) => setSelectedBankCode(e.target.value)}
                      className="w-full rounded-lg p-2 border border-zinc-300 bg-white"
                    >
                      <option value="">-- Select bank --</option>
                      {banks.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="rounded-lg p-2 border border-zinc-300 flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyAccount}
                      disabled={verifying || banksLoading}
                      className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                    >
                      {verifying ? "Verifying..." : "Verify account"}
                    </button>
                  </div>

                  {accountName && (
                    <div className="mt-2">
                      <label className="text-sm">Account name</label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full rounded-lg p-2 border border-zinc-300 mt-1"
                      />
                    </div>
                  )}
                </div>

								<div className="flex items-center gap-4">
									<div className="flex items-center bg-white rounded-full px-5 py-3 w-full border border-gray-300">
										<span className="mr-3 text-lg">₦</span>
										<input
											type="number"
											className="w-full outline-none text-[18px] placeholder-gray-400"
											placeholder="Amount"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
										/>
									</div>

									<button
										onClick={handleContinue}
										disabled={loading}
										className="px-6 py-3 rounded-full bg-blue-600 text-white min-w-[120px] disabled:opacity-50"
									>
										{loading ? "Processing..." : "Continue"}
									</button>
								</div>

								<p className="mt-3 text-sm text-gray-400">Please note that a transfer charge will be deducted from your account.</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
