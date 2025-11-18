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
		(state: any) => state.auth.value.balance,
	);

	const [transactionsFilter, setTransactionsFilter] = useState<
		"all" | "debit" | "credit" | "failed" | "successful" | "pending"
	>("all");
	const filters = ["all", "debit", "credit", "failed", "successful", "pending"];

	// <- replaced static array with state that will be populated from backend
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				
				const res = await fetch(`${apiEndpointBaseURL}/transactions`, {
					method: "GET",
					headers: { authorization: getAuthorization() },
				});


				// handle non-JSON or error responses gracefully
				let payload: any = null;
				try {
					payload = await res.json();
				} catch (err) {
					console.error("Failed to parse transactions response as JSON", err);
				}

				// Accept either { data: [...] } or [...]
				const items: Transaction[] = (payload && payload.data) ? payload.data : Array.isArray(payload) ? payload : [];

				// Ensure fallback to empty array if something went wrong
				setTransactions(items);
			} catch (err) {
				console.error("Error fetching transactions:", err);
				setTransactions([]);
			}
		};

		fetchTransactions();
	}, []);

	// keep everything else identical — uses your hook for grouping/summary
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
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="px-4 py-8 space-y-6 overflow-hidden min-h-full flex flex-col">
				<div className="flex gap-4 flex-1">
					<Link to="/">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Transactions History</h1>
						<p className="text-sm text-zinc-500">
							Track your payments and earnings with detailed records
						</p>
					</div>
				</div>

				<div className="bg-white shadow-md rounded-2xl flex-1 min-h-full p-4 space-y-10">
					<div className="flex items-center justify-center gap-4">
						<span className="text-center whitespace-nowrap">
							Transactions List:{" "}
						</span>{" "}
						<span className="max-w-44 flex-1">
							<Select
								placeholder="Filter"
								startContent={<Filter size={16} />}
								className="[&_button]:border-b [&_button]:bg-transparent [&_button]:border-zinc-400 [&_button]:rounded-full"
								onSelectionChange={(key) =>
									setTransactionsFilter(
										key.currentKey! as typeof transactionsFilter,
									)
								}
								required
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

					<div className="flex items-center gap-4 max-sm:flex-wrap pb-4 border-b border-b-zinc-400">
						<div className="flex flex-1 gap-2 items-center border border-zinc-400 rounded-xl p-3 whitespace-nowrap">
							<small>Total Earnings: </small>
							<span className="font-medium">
								₦{totalEarned.toLocaleString()}
							</span>
						</div>
						<div className="flex flex-1 gap-2 items-center border border-zinc-400 rounded-xl p-3 whitespace-nowrap">
							<small>Total Spent: </small>
							<span className="font-medium">
								₦{totalSpent.toLocaleString()}
							</span>
						</div>
						<div className="flex flex-1 gap-2 items-center border border-zinc-400 rounded-xl p-3 whitespace-nowrap">
							<small>Balance: </small>
							<span className="font-medium">
								₦{userBalance.toLocaleString()}
							</span>
						</div>
					</div>

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

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
	const navigate = useNavigate();

	return (
		<div className="max-w-full overflow-x-auto">
			<table className="min-w-full text-sm">
				<thead>
					<th className="bg-zinc-200 p-2">No.</th>
					<th className="bg-zinc-200 p-2">Description</th>
					<th className="bg-zinc-200 p-2">Amount</th>
					<th className="p-2">Status</th>
					<th className="p-2">Date</th>
					<th className="p-2">Type</th>
				</thead>
				<tbody>
					{transactions
						.sort(
							(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
						)
						.map((transaction, i) => (
							<tr
								onClick={() => navigate(`/transactions-history/${transaction.id}`)}
								className="cursor-pointer odd:bg-zinc-50 hover:bg-primary/10 transition-colors"
								key={`${transaction.id ?? i}-${transaction.date}`}
							>
								<td className="px-2 py-4">{i + 1}</td>
								<td className="px-2 py-4">{transaction.description}</td>
								<td className="px-2 py-4">
									₦{transaction.amount.toLocaleString()}
								</td>
								<td
									className={cn("px-2 py-4 capitalize", {
										"text-warning": transaction.status === "pending",
										"text-success": transaction.status === "successful",
										"text-danger": transaction.status === "failed",
									})}
								>
									{transaction.status}
								</td>
								<td className="px-2 py-4">
									{new Date(transaction.date).toDateString()}
								</td>
								<td className="px-2 py-4 capitalize">{transaction.type}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
