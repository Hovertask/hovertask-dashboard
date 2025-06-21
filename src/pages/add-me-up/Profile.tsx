import { ArrowLeft, Power, Trash, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { AuthUserDTO } from "../../../types";
import { type FormEvent, useState } from "react";
import Loading from "../_shared/components/Loading";
import { toast } from "sonner";
import Input from "../_shared/components/Input";
import AddMeUpAside from "../_shared/components/AddMeUpAside";

export default function Profile() {
	const authUser = useSelector<any, AuthUserDTO>(
		(state: any) => state.auth.value,
	);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function simulateLoading() {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 4000);
	}

	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-16 overflow-hidden min-h-full">
				<div className="flex gap-4 flex-1">
					<Link to="/add-me-up">
						<ArrowLeft />
					</Link>

					<div className="space-y-2">
						<h1 className="text-xl font-medium">Your Profile</h1>
						<p className="text-sm text-zinc-500">Manage Your Account</p>
					</div>
				</div>

				<div className="flex gap-4 justify-between flex-wrap items-start">
					<div className="flex gap-3 items-start">
						<img
							width={40}
							src={authUser.avatar || "/images/default-user.png"}
							alt=""
						/>
						<div>
							<p>
								{authUser.fname} {authUser.lname}
							</p>
							<p className="text-sm">@{authUser.username}</p>
							<p className="text-sm">Email: {authUser.email}</p>
						</div>
					</div>

					{isEditMode || (
						<button
							type="button"
							onClick={() => setIsEditMode(true)}
							className="py-3 px-8 text-xs rounded-full transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white"
						>
							Edit
						</button>
					)}
				</div>

				{isEditMode && <ProfileEditForm setIsEditMode={setIsEditMode} />}

				<div className="space-y-4">
					<button
						type="button"
						onClick={simulateLoading}
						className="py-2 px-8 text-sm rounded-md transition-all flex items-center gap-2 hover:bg-danger/80 active:scale-95 bg-danger text-white"
					>
						<Power size={16} /> Logout
					</button>
					<button
						type="button"
						onClick={simulateLoading}
						className="py-2 px-8 text-sm rounded-md transition-all flex items-center gap-2 hover:bg-danger/20 active:scale-95 border border-danger text-danger"
					>
						<Trash size={16} /> Delete Your Account
					</button>
				</div>
			</div>

			<AddMeUpAside />

			{isLoading && <Loading fixed />}
		</div>
	);
}

function ProfileEditForm(props: {
	setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { setIsEditMode } = props;
	const [isLoading, setIsLoading] = useState(false);

	function saveEdits(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsEditMode(false);
			toast.success("Profile updated successfully!");
		}, 2000);
	}
	return (
		<div className="p-4 rounded-3xl shadow">
			<div className="flex justify-end">
				<button
					type="button"
					className="hover:bg-zinc-100 active:scale-95 transition-all p-4 rounded-full"
					onClick={() => setIsEditMode(false)}
				>
					<X size={16} />
				</button>
			</div>

			<form onSubmit={saveEdits} className="space-y-6">
				<div className="max-w-md">
					<Input label="Name" placeholder="Enter your name" />
				</div>
				<div className="max-w-[200px]">
					<Input label="Username" placeholder="Enter your username" />
				</div>
				<div className="max-w-lg">
					<Input label="Email" type="email" placeholder="Enter your name" />
				</div>
				<button
					type="button"
					className="py-3 px-8 text-sm rounded-xl transition-all hover:bg-primary/80 active:scale-95 bg-primary text-white"
				>
					Save Profile Details
				</button>
			</form>

			{isLoading && <Loading fixed />}
		</div>
	);
}
