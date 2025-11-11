import { X } from "lucide-react";

export default function ComingSoonModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
			<div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[300px] relative">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-black"
				>
					<X size={18} />
				</button>
				<h2 className="text-lg font-semibold mb-2">🚧 Coming Soon</h2>
				<p className="text-sm text-gray-600">
					This feature is under development. Stay tuned!
				</p>
			</div>
		</div>
	);
}
