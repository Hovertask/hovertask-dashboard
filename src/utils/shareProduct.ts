import { toast } from "sonner";

export default function shareProduct(data: {
	name: string;
	id: string;
	description: string;
}) {
	toast.promise(
		() =>
			new Promise((resolve, reject) => {
				const shareData: ShareData = {
					title: data.name,
					text: data.description,
					url: `https://hovertask-dashboard.vercel.app/marketplace/p/${data.id}`,
				};

				window.navigator.share(shareData).then(resolve).catch(reject);
			}),
		{
			error: "Failed to share!",
			loading: "Please wait...",
			success: "product shared successfully!",
		},
	);
}
