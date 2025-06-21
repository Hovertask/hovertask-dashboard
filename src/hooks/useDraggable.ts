import React, { useEffect, useState } from "react";

export default function useDraggable(
	componentRef: React.RefObject<HTMLElement | null>,
) {
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		let scrollStartX = 0;

		function handleMousedown(e: MouseEvent) {
			const evTarget = e.currentTarget as HTMLElement;

			scrollStartX = e.screenX;
			setIsDragging(true);
			evTarget.addEventListener("mousemove", handleDrag);
		}

		function handleMouseup(e: MouseEvent) {
			const evTarget = e.currentTarget as HTMLElement;

			setIsDragging(false);
			evTarget.removeEventListener("mousemove", handleDrag);
		}

		function handleDrag(e: MouseEvent) {
			const evTarget = e.currentTarget as HTMLElement;
			const { screenX } = e;

			evTarget.scrollLeft += (scrollStartX - screenX) * 0.1;
		}

		if (componentRef.current) {
			componentRef.current.addEventListener("mousedown", handleMousedown);
			componentRef.current.addEventListener("mouseup", handleMouseup);
			componentRef.current.addEventListener("mouseleave", handleMouseup);
		}

		return () => {
			if (componentRef.current) {
				componentRef.current.removeEventListener("mousedown", handleMousedown);
				componentRef.current.removeEventListener("mouseup", handleMouseup);
				componentRef.current.removeEventListener("mousemove", handleDrag);
				componentRef.current.removeEventListener("mouseleave", handleMouseup);
			}
		};
	}, [componentRef.current]);

	return { isDragging };
}
