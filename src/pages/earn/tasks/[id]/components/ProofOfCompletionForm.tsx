import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { Camera } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import Loading from "../../../../../shared/components/Loading";
import apiEndpointBaseURL from "../../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../../utils/getAuthorization";
import { toast } from "sonner";

export default function ProofOfAdvertCompletionForm({ taskId, platform, }: { taskId: number; platform: string }) {
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [social_media_url, setSocialMediaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ For success modal
  const {
	onOpen: onOpenSuccess,
	onOpenChange: onOpenChangeSuccess,
	isOpen: isOpenSuccess,
  } = useDisclosure();

  // ✅ For already-submitted modal
  const {
	onOpen: onOpenAlready,
	onOpenChange: onOpenChangeAlready,
	isOpen: isOpenAlready,
  } = useDisclosure();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
	e.preventDefault();

	if (!selectedFile) {
	  toast.error("Please upload an image or video before submitting");
	  return;
	}

	try {
	  setIsSubmitting(true);

	  const formData = new FormData();
	  formData.append("screenshot", selectedFile);
	  formData.append("social_media_url", social_media_url);

	  const response = await fetch(
		`${apiEndpointBaseURL}/tasks/submit-task/${taskId}`,
		{
		  method: "POST",
		  body: formData,
		  headers: { authorization: getAuthorization() },
		}
	  );

	  const data = await response.json().catch(() => ({
		status: false,
		message: "Invalid server response",
	  }));

	  // ✅ Validation error (422)
	  if (response.status === 422) {
		const errors = data.errors || {};
		const message =
		  Object.values(errors).flat().join("\n") ||
		  data.message ||
		  "Validation failed";
		toast.error(message);
		return;
	  }

	  // ⚠️ Custom backend error (400, 404, etc.)
	  if (!response.ok || !data.status) {
		toast.error(data.message || "Something went wrong");

		// ✅ Show "already submitted" modal for duplicate submission
		if (
		  data.message?.toLowerCase().includes("already submitted") ||
		  data.message?.toLowerCase().includes("submitted this task")
		) {
		  onOpenAlready();
		}

		return;
	  }

	  // ✅ Success case
	  toast.success(data.message || "Task submitted successfully!");
	  onOpenSuccess();
	} catch (error) {
	  console.error("Error submitting task:", error);
	  toast.error("Failed to submit task. Please try again later.");
	} finally {
	  setIsSubmitting(false);
	}
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
	const file = e.target.files?.[0];
	if (file) {
	  setSelectedFile(file);
	  setSelectedMediaUrl(URL.createObjectURL(file));
	}
  }

  return (
	<form onSubmit={handleSubmit} className="max-w-lg space-y-4">
	  <h3 className="font-medium">Provide Proof of  Task Completion</h3>

	  <div className="max-sm:flex-wrap flex text-sm items-center gap-4">
		<div className="min-w-28 h-28 bg-black/15 rounded border border-zinc-300 relative [&>*]:cursor-pointer overflow-hidden">
		  <span className="absolute flex text-center items-center flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
			<Camera size={12} />
			<span>Upload proof (image/video)</span>
		  </span>
		  <input
			onChange={handleFileChange}
			type="file"
			name="screenshot"
			className="absolute inset-0 opacity-0"
			accept="image/*,video/*"
			required
		  />

		  {selectedMediaUrl && selectedFile && (
			selectedFile.type.startsWith("video/") ? (
			  <video
				src={selectedMediaUrl}
				controls
				className="h-full w-full object-cover block mx-auto"
			  />
			) : (
			  <img
				src={selectedMediaUrl}
				alt="proof"
				className="h-full w-full object-cover block mx-auto"
			  />
			)
		  )}
		</div>
       
		<div className="space-y-1">
		 {platform !== "whatsapp" && (
		  <p>
			Please enter the social media_account url  of the account you used to perform the
            task.
		  </p>
		 )}
		  <div className="flex items-center gap-4">
			 {platform !== "whatsapp" && (
			<input
			  placeholder="Enter your social media account Url "
			  className="bg-zinc-200 border border-zinc-300 p-2 rounded-xl flex-1 min-w-0"
			  type="text"
			  value={social_media_url}
			  onChange={(e) => setSocialMediaUrl(e.target.value)}
			  required
			/>
			 )}
			<button
			  type="submit"
			  disabled={isSubmitting}
			  className="px-2 py-1.5 text-sm bg-primary text-white active:scale-95 transition-transform rounded-full disabled:opacity-50"
			>
			  {isSubmitting ? "Submitting..." : "Submit Proof"}
			</button>
		  </div>
		</div>
		
	  </div>
		

	  {isSubmitting && <Loading fixed />}

	  {/* ✅ Success Modal */}
	  <Modal size="md" onOpenChange={onOpenChangeSuccess} isOpen={isOpenSuccess}>
		<ModalContent>
		  {() => (
			<ModalBody className="space-y-1 text-center pb-8">
			  <img src="/images/animated-checkmark.gif" alt="" />
			  <h3 className="font-medium text-lg">
				Task Submitted Successfully!
			  </h3>
			  <p className="text-sm">
				Your task submission has been received and is pending review.
				You'll be notified once it is verified.
			  </p>
			  <div className="flex items-center justify-center gap-4">
				<Link
				  to="/earn/tasks-history"
				  className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95"
				>
				  View Tasks History
				</Link>
				<Link
				  to="/"
				  className="p-2 rounded-xl text-sm transition-all border border-primary text-primary active:scale-95"
				>
				  Go to Dashboard
				</Link>
			  </div>
			</ModalBody>
		  )}
		</ModalContent>
	  </Modal>

	  {/* ⚠️ Already Submitted Modal */}
	  <Modal size="md" onOpenChange={onOpenChangeAlready} isOpen={isOpenAlready}>
		<ModalContent>
		  {() => (
			<ModalBody className="space-y-1 text-center pb-8">
			  <img src="/images/warning.gif" alt="warning" className="mx-auto w-24" />
			  <h3 className="font-medium text-lg text-red-600">
				Already Submitted!
			  </h3>
			  <p className="text-sm">
				You have already submitted proof for this task. You cannot
				submit it again.
			  </p>
			  <div className="flex items-center justify-center gap-4">
				<Link
				  to="/earn/tasks-history"
				  className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95"
				>
				  View Submissions
				</Link>
				<Link
				  to="/"
				  className="p-2 rounded-xl text-sm transition-all border border-primary text-primary active:scale-95"
				>
				  Go to Dashboard
				</Link>
			  </div>
			</ModalBody>
		  )}
		</ModalContent>
	  </Modal>
	</form>
  );
}
