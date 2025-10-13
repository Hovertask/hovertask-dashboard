import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { Camera } from "lucide-react";
import { type FormEvent, useState } from "react";
import Loading from "../../../../../shared/components/Loading";
import { Link } from "react-router";
import apiEndpointBaseURL from "../../../../../utils/apiEndpointBaseURL";
import getAuthorization from "../../../../../utils/getAuthorization";

export default function ProofOfTaskCompletionForm({ taskId }: { taskId: number }) {
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { onOpen, onOpenChange, isOpen } = useDisclosure();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please upload a screenshot before submitting");
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare form data
            const formData = new FormData();
            formData.append("screenshot", selectedFile);
            formData.append("username", username);

            
            // Send request
            const response = await fetch(
                `${apiEndpointBaseURL}/tasks/submit-task/${taskId}`,
                {
                    method: "POST",
                    body: formData,
                    headers:{ authorization: getAuthorization() },
                }
            );

            const data = await response.json();

            if (response.ok && data.status) {
                onOpen();
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting task:", error);
            alert("Failed to submit task");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
            <h3 className="font-medium">Provide Proof of Task Completion</h3>

            <div className="max-sm:flex-wrap flex text-sm items-center gap-4">
                <div className="min-w-28 h-28 bg-black/15 rounded border border-zinc-300 relative [&>*]:cursor-pointer overflow-hidden">
                    <span className="absolute flex text-center items-center flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
                        <Camera size={12} />
                        <span>Upload proof</span>
                    </span>
                    <input
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setSelectedFile(file);
                                setSelectedImageUrl(URL.createObjectURL(file));
                            }
                        }}
                        type="file"
                        name="screenshot"
                        className="absolute inset-0 opacity-0"
                        accept="image/*"
                        required
                    />
                    {selectedImageUrl && (
                        <img
                            src={selectedImageUrl}
                            alt="proof"
                            className="h-full w-full object-cover block mx-auto"
                        />
                    )}
                </div>

                <div className="space-y-1">
                    <p>
                        Please enter the username of the account you used to perform the task,
                        e.g. Instagram username.
                    </p>
                    <div className="flex items-center gap-4">
                        <input
                            placeholder="Enter your username"
                            className="bg-zinc-200 border border-zinc-300 p-2 rounded-xl flex-1 min-w-0"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="px-2 py-1.5 text-sm bg-primary text-white active:scale-95 transition-transform rounded-full"
                        >
                            Submit Proof
                        </button>
                    </div>
                </div>
            </div>

            {isSubmitting && <Loading fixed />}

            <Modal size="md" onOpenChange={onOpenChange} isOpen={isOpen}>
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
        </form>
    );
}
