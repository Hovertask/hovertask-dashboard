import { useEffect, useState } from "react";

export default function useWindowDimensions() {
	const [innerHeight, setInnerHeight] = useState(window.innerHeight);
	const [innerWidth, setInnerWidth] = useState(window.innerWidth);
	const [outerWidth, setOuterWidth] = useState(window.outerWidth);
	const [outerHeight, setOuterHeight] = useState(window.outerHeight);

	useEffect(() => {
		function updateDimensions() {
			setInnerHeight(window.innerHeight);
			setInnerWidth(window.innerWidth);
			setOuterWidth(window.outerWidth);
			setOuterHeight(window.outerHeight);
		}

		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	return {
		innerHeight,
		innerWidth,
		outerHeight,
		outerWidth,
	};
}
