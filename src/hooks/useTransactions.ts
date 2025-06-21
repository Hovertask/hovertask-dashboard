import { Transaction } from "../../types";

export default function useTransactions(transactions: Transaction[]) {
	let debit: Transaction[] = [],
		credit: Transaction[] = [],
		failed: Transaction[] = [],
		pending: Transaction[] = [],
		successful: Transaction[] = [],
		totalEarned = 0,
		totalSpent = 0;

	for (let transaction of transactions) {
		if (transaction.type === "credit") {
			totalEarned += transaction.amount;
			credit.push(transaction);
		} else {
			totalSpent += transaction.amount;
			debit.push(transaction);
		}

		if (transaction.status === "successful") successful.push(transaction);
		else if (transaction.status === "pending") pending.push(transaction);
		else failed.push(transaction);
	}

	return {
		debit,
		credit,
		totalEarned,
		totalSpent,
		failed,
		pending,
		successful,
	};
}
