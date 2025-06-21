export default function getPercentageValue(
	originalValue: number,
	percentage: number,
) {
	if (percentage < 0 || percentage > 100) {
		throw new Error("Percentage must be between 0 and 100");
	}
	return originalValue - (originalValue * percentage) / 100;
}
