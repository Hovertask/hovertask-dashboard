import { Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { Transaction } from "../../types";
import UserProfileCard from "../shared/components/UserProfileCard";
import useTransactions from "../hooks/useTransactions";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";
import cn from "../utils/cn";

export default function TransactionsHistoryPage() {
	const userBalance = useSelector<any, number>(
		(state: any) => state.auth.value.balance
	);

	const [transactionsFilter, setTransactionsFilter] = useState<
		"all" | "debit" | "credit" | "failed" | "successful" | "pending"
	>("all");

	const filters = ["all", "debit", "credit", "failed", "successful", "pending"];
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const res = await fetch(`${apiEndpointBaseURL}/transactions`, {
					method: "GET",
					headers: { authorization: getAuthorization() },
				});

				let payload: any = null;

				try {
					payload = await res.json();
				} catch (err) {
					console.error("Failed to parse transactions response as JSON", err);
				}

				const items: Transaction[] =
					payload?.data ?? (Array.isArray(payload) ? payload : []);

				setTransactions(items);
			} catch (err) {
				console.error("Error fetching transactions:", err);
				setTransactions([]);
			}
		};

		fetchTransactions();
	}, []);

	const {
		totalSpent,
		credit,
		debit,
		totalEarned,
		failed,
		pending,
		successful,
	} = useTransactions(transactions);

	return (
		<div className="grid lg:grid-cols-[1fr_250px] gap-4 min-h-full px-3 sm:px-4">
			<div className="py-6 space-y-6 flex flex-col min-h-full">
				{/* Header */}
				<div className="flex gap-3 items-start">
					<Link to="/">
						<ArrowLeft size={20} />
					</Link>

					<div>
						<h1 className="text-xl font-semibold">Transactions History</h1>
						<p className="text-sm text-zinc-500">
							Track all your payments and earnings
						</p>
					</div>
				</div>

				{/* Main Card */}
				<div className="bg-white shadow-md rounded-2xl p-4 space-y-10 flex-1 overflow-auto min-w-0">
					{/* Select Filter */}
					<div className="flex items-center justify-center gap-3 flex-wrap">
						<span className="whitespace-nowrap text-sm">Transactions List:</span>

						<div className="w-full max-w-56">
							<Select
								placeholder="Filter"
								startContent={<Filter size={16} />}
								className="[&_button]:border-b [&_button]:bg-transparent [&_button]:rounded-full"
								onSelectionChange={(key) =>
									setTransactionsFilter(
										key.currentKey! as typeof transactionsFilter
									)
								}
							>
								{filters.map((filter) => (
									<SelectItem key={filter} className="capitalize">
										{filter === "all"
											? "All Transactions"
											: filter.replace(/^\w/, (s) => s.toUpperCase())}
									</SelectItem>
								))}
							</Select>
						</div>
					</div>

					{/* Summary Cards */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4 border-b border-zinc-300">
						<div className="flex items-center border p-3 rounded-xl gap-2 flex-col sm:flex-row text-center sm:text-left">
							<small>Total Earnings</small>
							<span className="font-semibold">
								₦{totalEarned.toLocaleString("en-NG")}
							</span>
						</div>

						<div className="flex items-center border p-3 rounded-xl gap-2 flex-col sm:flex-row text-center sm:text-left">
							<small>Total Spent</small>
							<span className="font-semibold">
								₦{totalSpent.toLocaleString("en-NG")}
							</span>
						</div>

						<div className="flex items-center border p-3 rounded-xl gap-2 flex-col sm:flex-row text-center sm:text-left col-span-2 sm:col-span-1">
							<small>Balance</small>
							<span className="font-semibold">
								₦{userBalance.toLocaleString()}
							</span>
						</div>
					</div>

					{/* Table */}
					<ResponsiveTransactionsList
						transactions={
							transactionsFilter === "all"
								? transactions
								: transactionsFilter === "credit"
								? credit
								: transactionsFilter === "debit"
								? debit
								: transactionsFilter === "failed"
								? failed
								: transactionsFilter === "pending"
								? pending
								: successful
						}
					/>
				</div>
			</div>

			{/* Profile Card (hidden on small screens) */}
			<div className="hidden lg:block">
				<UserProfileCard />
			</div>
		</div>
	);
}

/* ---------------------------------------------
   RESPONSIVE TABLE + MOBILE CARD VIEW
----------------------------------------------*/

function ResponsiveTransactionsList({ transactions }: { transactions: Transaction[] }) {
	const sorted = [...transactions].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	return (
		<div className="w-full">
			{/* Desktop Table */}
			<div className="hidden md:block overflow-x-auto rounded-xl">
				<TransactionsTable transactions={sorted} />
			</div>

			{/* Mobile Cards */}
			<div className="md:hidden space-y-3">
				{sorted.map((t, i) => (
					<TransactionCard key={i} transaction={t} index={i} />
				))}
			</div>
		</div>
	);
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
	const navigate = useNavigate();

	return (
		<table className="min-w-full table-auto text-sm">
			<thead>
				<tr className="bg-zinc-200 text-left">
					<th className="p-2 w-12">No.</th>
					<th className="p-2 min-w-48">Description</th>
					<th className="p-2 min-w-32">Amount</th>
					<th className="p-2 min-w-28">Status</th>
					<th className="p-2 min-w-40">Date</th>
					<th className="p-2 min-w-28">Type</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, i) => (
					<tr
						onClick={() => navigate(`/transactions-history/${transaction.id}`)}
						key={transaction.id}
						className="cursor-pointer odd:bg-zinc-50 hover:bg-primary/10 transition-colors"
					>
						<td className="p-2">{i + 1}</td>
						<td className="p-2 truncate">{transaction.description}</td>
						<td className="p-2 font-medium truncate">
							₦{transaction.amount.toLocaleString()}
						</td>
						<td
							className={cn("p-2 capitalize", {
								"text-warning": transaction.status === "pending",
								"text-success": transaction.status === "successful",
								"text-danger": transaction.status === "failed",
							})}
						>
							{transaction.status}
						</td>
						<td className="p-2 whitespace-nowrap">
							{new Date(transaction.created_at).toDateString()}
						</td>
						<td className="p-2 capitalize">{transaction.type}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

/* ---------------------------------------------
   MOBILE CARD COMPONENT
----------------------------------------------*/

function TransactionCard({ transaction, index }: { transaction: Transaction; index: number }) {
	const navigate = useNavigate();
	return (
		<div
			onClick={() => navigate(`/transactions-history/${transaction.id}`)}
			className="p-4 bg-zinc-100 rounded-xl border shadow-sm active:scale-[0.99] transition"
		>
			<div className="flex justify-between mb-2">
				<span className="text-xs text-zinc-500">#{index + 1}</span>
				<span
					className={cn("capitalize text-xs font-medium", {
						"text-warning": transaction.status === "pending",
						"text-success": transaction.status === "successful",
						"text-danger": transaction.status === "failed",
					})}
				>
					{transaction.status}
				</span>
			</div>

			<div className="font-semibold truncate">{transaction.description}</div>

			<div className="mt-2 text-sm">
				<div className="flex justify-between py-1">
					<span className="text-zinc-600">Amount</span>
					<span className="font-medium">₦{transaction.amount.toLocaleString()}</span>
				</div>

				<div className="flex justify-between py-1">
					<span className="text-zinc-600">Type</span>
					<span className="capitalize">{transaction.type}</span>
				</div>

				<div className="flex justify-between py-1">
					<span className="text-zinc-600">Date</span>
					<span className="truncate text-right">
						{new Date(transaction.created_at).toDateString()}
					</span>
				</div>
			</div>
		</div>
	);
}
// ------------------ End of TransactionsHistoryPage ------------------