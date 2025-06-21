import EditPassword from "../components/EditPassword";

export default function ChangePasswordPage() {
	return (
		<div className="mobile:grid grid-cols-[1fr_214px] gap-4 min-h-full">
			<div className="bg-white shadow-md px-4 py-8 space-y-5 overflow-hidden min-h-full rounded-t-3xl">
				<EditPassword />
			</div>
		</div>
	);
}
