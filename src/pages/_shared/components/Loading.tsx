import { useEffect } from "react";
import { createPortal } from "react-dom";

/** UI that signifies loading state. */
export default function Loading({
	fixed,
}: { fixed?: boolean; animationOnly?: boolean }) {
	useEffect(() => {
		// Disable scrolling while the loading state is active
		if (fixed) document.body.style.overflow = "hidden";

		return () => {
			// Enable scrolling after loading state has been removed
			document.body.style.overflow = "auto";
		};
	}, [fixed]);

	return fixed ? (
		createPortal(
			<div className="flex items-center justify-center fixed mt-0 inset-0 bg-white/80 z-[999999]">
				<img src="/images/loading.gif" alt="" />
			</div>,
			document.body,
		)
	) : (
		<img src="/images/loading.gif" className="mx-auto" alt="" />
	);
}
