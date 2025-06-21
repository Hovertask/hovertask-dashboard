import { useEffect, useLayoutEffect, useRef, useState } from "react";
import cn from "../../../utils/cn";

export default function Carousel({
	children,
}: { children: React.ReactNode[] }) {
	const childrenLength = children.length;
	const [activeWindow, setActiveWindow] = useState<number>(1);
	const [carouselWidth, setCarouselWidth] = useState<number>(0);
	const carouselRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const activeWindowIndex = activeWindow - 1;
		const carousel = carouselRef.current;

		if (carousel) {
			carousel.scroll({
				left: carouselWidth * activeWindowIndex,
				behavior: "smooth",
			});
		}
	}, [activeWindow, carouselWidth]);

	useEffect(() => {
		const intervalId = setInterval(
			() =>
				setActiveWindow((activeWindow) => {
					return activeWindow + 1 > childrenLength ? 1 : activeWindow + 1;
				}),
			3000,
		);
		return () => clearInterval(intervalId);
	}, [childrenLength]);

	useLayoutEffect(() => {
		setCarouselWidth(carouselRef.current?.clientWidth || 0);
		const handleResize = () => {
			setCarouselWidth(carouselRef.current?.clientWidth || 0);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="max-w-full min-w-full">
			<div ref={carouselRef} className="flex max-w-full overflow-hidden">
				{children.map((child) => (
					<div key={Math.random()} className="w-full min-w-full">
						{child}
					</div>
				))}
			</div>
			<div className="flex items-center justify-center gap-0.5">
				{children.map((_, i) => (
					<div
						key={Math.random()}
						className={cn("w-6 h-0.5", {
							"bg-primary": activeWindow - 1 === i,
							"bg-gray-300": activeWindow - 1 !== i,
						})}
					/>
				))}
			</div>
		</div>
	);
}
