export default function useDebounce<T extends any[]>(
	func: (...args: T) => void,
	delay: number,
) {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function (...args: T) {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
