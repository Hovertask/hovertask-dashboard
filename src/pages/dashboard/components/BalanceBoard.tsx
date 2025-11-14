import { Wallet } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import WithdrawModal from "./WithdrawModal"; // import your modal component

interface BalanceBoardProps {
  balance?: number;
  earned?: number;
  pending?: number;
  spent?: number;
}

export default function BalanceBoard({
  balance = 0,
  earned = 0,
  pending = 0,
  spent = 0,
}: BalanceBoardProps) {
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleOpenWithdraw = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWithdraw(true);
  };

  const handleCloseWithdraw = () => setShowWithdraw(false);

  return (
    <div className="space-y-3">
      {/* Total Balance */}
      <div className="flex items-center gap-2">
        <span className="text-[18.66px] font-medium">Total Balance</span>
      </div>

      {/* Balance Amount + Fund / Withdraw Buttons */}
      <div className="flex items-center gap-12 flex-wrap">
        <div className="text-[34.67px] font-medium">₦{balance.toLocaleString()}</div>
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

      {/* Earned / Pending / Spent Section */}
      <div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-[#DAE2FF] p-8 rounded-2xl">
        {/* Earned */}
        <div className="space-y-3 py-2">
          <p className="text-[13.87px]">Earned</p>
          <p className="text-[20.8px] font-medium">₦{earned.toLocaleString()}</p>
        </div>

        <div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

        {/* Pending */}
        <div className="space-y-3 py-2">
          <p className="text-[13.87px]">Pending</p>
          <p className="text-[20.8px] font-medium">₦{pending.toLocaleString()}</p>
        </div>

        <div className="self-stretch border-r border-[0.73px] border-[#B3B3B3]" />

        {/* Spent */}
        <div className="space-y-3 py-2">
          <p className="text-[13.87px]">Spent</p>
          <p className="text-[20.8px] font-medium">₦{spent.toLocaleString()}</p>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <WithdrawModal
          show={showWithdraw}
          onClose={handleCloseWithdraw}
          balance={balance}
        />
      )}
    </div>
  );
}
