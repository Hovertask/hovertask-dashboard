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
		<div className="grid mobile:grid-cols-[1fr_220px] gap-4 min-h-full">
			<div className="px-4 py-8 space-y-6 flex flex-col min-h-full">
				{/* Page Header */}
				<div className="flex gap-4 flex-1 items-start">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-1">
						<h1 className="text-xl font-semibold">Transactions History</h1>
						<p className="text-sm text-zinc-500">
							Track your payments and earnings with detailed records
						</p>
					</div>
				</div>

				{/* Main Container */}
				<div className="bg-white shadow-md rounded-2xl flex-1 p-4 space-y-10 overflow-hidden">
					{/* Filter */}
					<div className="flex items-center justify-center gap-3 max-sm:flex-wrap">
						<span className="text-center whitespace-nowrap">Transactions List:</span>

						<span className="w-full max-w-48">
							<Select
								placeholder="Filter"
								startContent={<Filter size={16} />}
								className="[&_button]:border-b [&_button]:bg-transparent [&_button]:border-zinc-400 [&_button]:rounded-full"
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
						</span>
					</div>

					{/* Summary Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-b border-zinc-300">
						<div className="flex items-center border p-3 rounded-xl gap-2">
							<small>Total Earnings:</small>
							<span className="font-semibold truncate">
								₦{totalEarned.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
							</span>
						</div>

						<div className="flex items-center border p-3 rounded-xl gap-2">
							<small>Total Spent:</small>
							<span className="font-semibold truncate">
								₦{totalSpent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
							</span>
						</div>

						<div className="flex items-center border p-3 rounded-xl gap-2">
							<small>Balance:</small>
							<span className="font-semibold truncate">
								₦{userBalance.toLocaleString()}
							</span>
						</div>
					</div>

					{/* Tables */}
					{transactionsFilter === "all" && (
						<TransactionsTable transactions={transactions} />
					)}
					{transactionsFilter === "debit" && (
						<TransactionsTable transactions={debit} />
					)}
					{transactionsFilter === "credit" && (
						<TransactionsTable transactions={credit} />
					)}
					{transactionsFilter === "failed" && (
						<TransactionsTable transactions={failed} />
					)}
					{transactionsFilter === "pending" && (
						<TransactionsTable transactions={pending} />
					)}
					{transactionsFilter === "successful" && (
						<TransactionsTable transactions={successful} />
					)}
				</div>
			</div>

			<div className="hidden mobile:block">
				<UserProfileCard />
			</div>
		</div>
	);
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
	const navigate = useNavigate();

	return (
		<div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-400 rounded-xl">
			<table className="min-w-full table-auto text-sm">
				<thead>
					<tr className="bg-zinc-200 text-left">
						<th className="p-2 whitespace-nowrap w-12">No.</th>
						<th className="p-2 whitespace-nowrap min-w-48">Description</th>
						<th className="p-2 whitespace-nowrap min-w-32">Amount</th>
						<th className="p-2 whitespace-nowrap min-w-28">Status</th>
						<th className="p-2 whitespace-nowrap min-w-40">Date</th>
						<th className="p-2 whitespace-nowrap min-w-28">Type</th>
					</tr>
				</thead>

				<tbody>
					{transactions
						.sort(
							(a, b) =>
								new Date(b.created_at).getTime() -
								new Date(a.created_at).getTime()
						)
						.map((transaction, i) => (
							<tr
								onClick={() => navigate(`/transactions-history/${transaction.id}`)}
								key={`${transaction.id ?? i}-${transaction.created_at}`}
								className="cursor-pointer odd:bg-zinc-50 hover:bg-primary/10 transition-colors"
							>
								<td className="px-2 py-3 text-xs sm:text-sm">{i + 1}</td>

								<td className="px-2 py-3 truncate max-w-[200px]">
									{transaction.description}
								</td>

								<td className="px-2 py-3 font-medium truncate max-w-[150px] whitespace-nowrap">
									₦{transaction.amount.toLocaleString()}
								</td>

								<td
									className={cn(
										"px-2 py-3 capitalize whitespace-nowrap",
										{
											"text-warning": transaction.status === "pending",
											"text-success": transaction.status === "successful",
											"text-danger": transaction.status === "failed",
										}
									)}
								>
									{transaction.status}
								</td>

								<td className="px-2 py-3 whitespace-nowrap truncate max-w-[180px]">
									{new Date(transaction.created_at).toDateString()}
								</td>

								<td className="px-2 py-3 capitalize whitespace-nowrap">
									{transaction.type}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
