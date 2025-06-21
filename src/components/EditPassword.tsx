import { useState } from "react";
import Input from "../pages/_shared/components/Input";
import { Lock, User, X } from "lucide-react";

export default function EditPassword() {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-medium">Security</h2>

			<div className="space-y-3">
				<div className="flex gap-4 items-center px-4 py-6 rounded-3xl border border-zinc-400">
					<User size={28} className="text-primary" />
					<p className="flex-1 line-clamp-1">Change your password</p>
					<button
						onClick={() => setIsEditing(true)}
						className="px-4 py-2 rounded-full text-sm transition-all active:scale-95 bg-primary text-white"
					>
						Edit Info
					</button>
				</div>

				{isEditing && <EditPasswordForm setIsOpen={setIsEditing} />}
			</div>
		</div>
	);
}

function EditPasswordForm(props: {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div className="shadow-md rounded-3xl p-6 space-y-6">
			<div className="flex justify-end">
				<button
					onClick={() => props.setIsOpen(false)}
					className="p-2 rounded-full hover:bg-zinc-100 active:scale-95 transition-transform"
				>
					<X size={18} />
				</button>
			</div>

			<form className="space-y-4">
				<Input
					label="Old Password"
					placeholder="Enter old password"
					icon={<Lock size={14} />}
					type="password"
				/>
				<Input
					label="New Password"
					placeholder="Enter new password"
					icon={<Lock size={14} />}
					type="password"
				/>
				<Input
					label="Confirm New Password"
					placeholder="Confirm new password"
					icon={<Lock size={14} />}
					type="password"
				/>
				<button
					type="submit"
					className="px-4 py-3 rounded-2xl transition-all active:scale-95 bg-primary text-white"
				>
					Save
				</button>
			</form>
		</div>
	);
}
