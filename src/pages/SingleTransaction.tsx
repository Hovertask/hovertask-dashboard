import { ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import UserProfileCard from "../shared/components/UserProfileCard";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";

export default function SingleTransactionPage() {
	const { id } = useParams(); // Get transaction ID from URL
	const [transaction, setTransaction] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	async function share() {
		try {
			await window.navigator?.share({
				text: window.location.href,
			});
			toast.success("Share successful!");
		} catch (error) {
			toast.error("Failed to share");
		}
	}

	useEffect(() => {
		const fetchTransaction = async () => {
			try {
				
				const res = await fetch(`${apiEndpointBaseURL}/transactions/${id}`,
					{
						headers: { authorization: getAuthorization() },
					},
				);

				const data = await res.json();

				if (res.ok) {
					setTransaction(data.data);
				} else {
					toast.error(data.message || "Transaction not found");
				}
			} catch (error) {
				console.error(error);
				toast.error("Failed to fetch transaction");
			} finally {
				setLoading(false);
			}
		};

		fetchTransaction();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Loading transaction...</p>
			</div>
		);
	}

	if (!transaction) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-danger">Transaction not found</p>
			</div>
		);
	}

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-5 overflow-hidden min-h-full rounded-t-3xl">
				<div className="flex gap-4 flex-1">
					<Link to="/transactions-history">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Detailed Transaction View</h1>
						<p className="text-sm text-zinc-500">
							Track your payments and earnings with detailed records
						</p>
					</div>
				</div>

				<hr className="border-dashed" />

				<div className="bg-primary/10 p-6 rounded-3xl">
					<ul className="list-disc list-inside">
						<li>
							<span className="text-zinc-500">Transaction ID: </span>
							<span className="font-medium">{transaction.id}</span>
						</li>

						<li>
							<span className="text-zinc-500">Type: </span>
							<span className="font-medium capitalize">
								{transaction.type}
							</span>
						</li>

						<li>
							<span className="text-zinc-500">Amount: </span>
							<span className="font-medium">
								₦{Number(transaction.amount).toLocaleString()}
							</span>
						</li>

						<li>
							<span className="text-zinc-500">Date: </span>
							<span className="font-medium">
								{new Date(transaction.date).toLocaleString()}
							</span>
						</li>

						<li>
							<span className="text-zinc-500">Description: </span>
							<span className="font-medium">{transaction.description}</span>
						</li>

						<li>
							<span className="text-zinc-500">Payment Method: </span>
							<span className="font-medium">
								{transaction.payment_method || "N/A"}
							</span>
						</li>

						<li>
							<span className="text-zinc-500">Quantity Purchased: </span>
							<span className="font-medium">
								{transaction.quantity || 1}
							</span>
						</li>

						<li>
							<span className="text-zinc-500">Status: </span>
							<span
								className={
									transaction.status === "successful"
										? "font-medium text-success"
										: transaction.status === "failed"
											? "font-medium text-danger"
											: "font-medium text-warning"
								}
							>
								{transaction.status}
							</span>
						</li>
					</ul>

					<div className="flex justify-end">
						<button
							onClick={share}
							className="px-8 py-3 bg-gradient-to-b from-primary/20 to-transparent rounded-xl transition-transform active:scale-95"
						>
							<Share2 size={18} />
						</button>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<Link
						to="/"
						className="px-4 py-2 text-sm rounded-2xl transition-all active:scale-95 bg-primary text-white"
					>
						Back To Dashboard
					</Link>
					<button className="px-4 py-2 text-sm rounded-2xl transition-all active:scale-95 border border-primary text-primary">
						Download
					</button>
				</div>

				<p className="text-center text-primary">
					<Link to="/support" className="underline text-sm">
						Contact Support
					</Link>
				</p>
			</div>

			<div>
				<UserProfileCard />
			</div>
		</div>
	);
}
