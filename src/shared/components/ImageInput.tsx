import { Image, Video } from "lucide-react";
import {
  type DragEvent,
  type InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import cn from "../../utils/cn";

export default function MediaInput(
  props: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "accept" | "onChange" | "className"
  > & {
    maxFileSizeMB?: number; // ✅ added
  },
) {
  let { maxLength, maxFileSizeMB = 20, ...rest } = props;
  const [draggedOver, setDraggedOver] = useState(false);
  const [filesLength, setFilesLength] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  if (!maxLength) maxLength = Number.POSITIVE_INFINITY;

  useEffect(() => {
    if (inputRef.current?.files?.length) {
      const file = inputRef.current.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFileType(file.type.startsWith("video") ? "video" : "image");

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [filesLength]);

  function verifyMimeType(file: File) {
    return /^(image|video)\//.test(file.type);
  }

  function verifyFileSize(file: File) {
    const sizeMB = file.size / (1024 * 1024);
    return sizeMB <= maxFileSizeMB;
  }

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
      if (!files?.length) return;

      const fileArr = Array.from(files);

      if (!fileArr.every(verifyMimeType))
        return toast.warning("Only images and videos are allowed.");
      if (fileArr.length > 5)
        return toast.error("Only a maximum of 5 files is allowed.");

      if (!fileArr.every(verifyFileSize))
        return toast.error(`Each file must be ≤ ${maxFileSizeMB} MB.`);

      if (inputRef.current) {
        inputRef.current.files = files as any;
        setFilesLength(files.length);
      }
    } finally {
      setDraggedOver(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return toast.warning("Please select a media file.");

    if (files.length > maxLength!) {
      e.target.value = "";
      return toast.error(`Only a maximum of ${maxLength} files is allowed.`);
    }

    const file = files[0];

    if (!verifyMimeType(file))
      return toast.warning("Only images or videos are allowed.");
    if (!verifyFileSize(file))
      return toast.error(`Each file must be ≤ ${maxFileSizeMB} MB.`);

    setFilesLength(files.length);
    setPreviewUrl((prev) => {
      URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setFileType(file.type.startsWith("video") ? "video" : "image");
  }

  return (
    <div className="space-y-1">
      <div
        onKeyUp={() => inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragOut}
        className={cn(
          "aspect-video bg-zinc-200/50 rounded-lg relative border border-zinc-300 text-sm overflow-hidden cursor-pointer",
          {
            "border-dashed border-4": draggedOver,
          },
        )}
      >
        <input
          ref={inputRef}
          onChange={handleChange}
          type="file"
          accept="image/*,video/*"
          name={fileType === "video" ? "video_path" : "file_path"} //  dynamic name
          className="opacity-0"
          {...rest}
          multiple={maxLength ? maxLength > 1 : false}
        />

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center flex-col gap-2 text-center z-10 bg-white/50",
            {
              hidden: !!filesLength,
            },
          )}
        >
          {draggedOver ? (
            <p>Drop it like it's hot 🔥</p>
          ) : (
            <>
              <Image />
              <Video />
              <span>Click or Drag & Drop (Image / Video)</span>
            </>
          )}
        </div>

        {previewUrl &&
          (fileType === "video" ? (
            <video
              src={previewUrl}
              controls
              className="max-h-full max-w-full block mx-auto"
            />
          ) : (
            <img
              src={previewUrl}
              className="max-h-full max-w-full block mx-auto object-contain"
              alt=""
            />
          ))}
      </div>

      {/* ✅ Display upload limits */}
      <p className="text-xs text-gray-500 text-center">
        Maximum {maxLength} file(s), up to {maxFileSizeMB} MB each
      </p>
    </div>
  );
}
