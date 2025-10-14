import { Image } from "lucide-react";
import {
	type DragEvent,
	type InputHTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import cn from "../../utils/cn";

export default function ImageInput(
	props: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "accept" | "onChange" | "className"
	>,
) {
	let { maxLength, ...rest } = props;
	const [draggedOver, setDraggedOver] = useState(false);
	const [imagesLength, setImagesLength] = useState<number>(0);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const [previewImageUrl, setPreviewImageUrl] = useState("");

	if (!maxLength) maxLength = Number.POSITIVE_INFINITY;

	useEffect(() => {
  if (imageInputRef.current?.files?.length) {
    const file = imageInputRef.current.files[0];
    const objectUrl = URL.createObjectURL(file);
    setPreviewImageUrl(objectUrl);

    // ✅ cleanup old URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }
}, [imagesLength]);

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setDraggedOver(true);
	}

	function handleDragOut(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setDraggedOver(false);
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();

		try {
			const files = e.dataTransfer?.files;
			function verifyMimetype(file: File) {
				return /image\/.*/.test(file.type);
			}

			if (files.length) {
				const fileArr = Array.from(files);

				if (!fileArr.every(verifyMimetype))
					return toast.warning("Only images are allowed.");
				if (files.length > 5)
					return toast.error("Only a maximum of 5 images is allowed");
				if (imageInputRef.current) {
					imageInputRef.current.files = files;
					setImagesLength(files.length);
				}
			}
		} finally {
			setDraggedOver(false);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > maxLength!) {
			e.target.files = null;
			return toast.error(`Only a maximum of ${maxLength} images is allowed`);
		}

		if (!e.target.files || !e.target.files?.length)
			return toast.warning("Please select an image");

		setImagesLength(e.target.files?.length!);
		setPreviewImageUrl((prev) => {
			URL.revokeObjectURL(prev);
			return URL.createObjectURL(e.target.files![0]);
		});
	}

	return (
		<div
			onKeyUp={() => imageInputRef.current?.click()}
			onClick={() => imageInputRef.current?.click()}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onDragLeave={handleDragOut}
			className={cn(
				"aspect-video bg-zinc-200/50 rounded-lg relative border border-zinc-300 text-sm",
				{
					"border-dashed border-4": draggedOver,
				},
			)}
		>
			<input
				ref={imageInputRef}
				onChange={handleChange}
				type="file"
				accept="image/*"
				className="opacity-0"
				{...rest}
				multiple={maxLength ? maxLength > 1 : false}
			/>

			<div
				className={cn(
					"absolute inset-0 flex items-center justify-center flex-col gap-2 text-center",
					{
						"bg-white/50": !!imagesLength,
					},
				)}
			>
				{draggedOver ? (
					<p>Drop it like it's hot</p>
				) : (
					<>
						<Image />
						Drag, Drop and Upload Your Photo
					</>
				)}
			</div>

			<img
				src={previewImageUrl}
				className="max-h-full max-w-full block mx-auto"
				alt=""
			/>
		</div>
	);
}
