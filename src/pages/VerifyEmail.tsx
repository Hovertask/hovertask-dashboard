
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { AuthUserDTO } from "../../types";
import axios from "axios";

export default function VerifyEmail() {
  const authUser = useSelector<{ auth: { value: AuthUserDTO } }, AuthUserDTO>(
    (state) => state.auth.value,
  );
  const [step, setStep] = useState<'send' | 'input'>('send');
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const email = authUser?.email || "";

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    setSending(true);
    try {
  await axios.post("https://backend.hovertask.com/api/resend-email-code", { email });
      setStep('input');
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send code");
    }
    setSending(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code) {
      setError("Verification code is required");
      return;
    }
    setSending(true);
    try {
  await axios.post("https://backend.hovertask.com/api/verify-email-code", { email, code });
      // Optionally, redirect or show success message
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid code");
    }
    setSending(false);
  };

  const handleResend = async () => {
    setSending(true);
    setError("");
    try {
  await axios.post("https://backend.hovertask.com/api/resend-email-code", { email });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend code");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-md rounded-3xl p-8 max-w-md w-full text-center">
        <img src="/images/animated-checkmark.gif" alt="Verify Email" className="mx-auto mb-4 w-20 h-20" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="mb-6 text-gray-600">To continue, please verify your email address.</p>

        {step === 'send' ? (
          <form className="space-y-4" onSubmit={handleSendCode}>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100"
              value={email}
              disabled
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-full font-semibold"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter verification code"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-full font-semibold"
            >
              Verify Email
            </button>
            <button
              type="button"
              className="w-full bg-primary/10 text-primary py-2 rounded-full font-semibold mt-2"
              onClick={handleResend}
              disabled={sending}
            >
              {sending ? "Resending..." : "Resend Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
