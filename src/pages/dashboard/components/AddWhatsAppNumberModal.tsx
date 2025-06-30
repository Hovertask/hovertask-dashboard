import { useForm } from "react-hook-form";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Input from "../../../shared/components/Input";
import { ChevronDown } from "lucide-react";
import Loading from "../../../shared/components/Loading";
import { phoneNumberValidation } from "../../../utils/inputValidationPatterns";
import submitPhoneNumber from "../utils/submitPhoneNumber";
import { toast } from "sonner";

/** Prompts user to enter their WhatsApp number
 * which would be used to gain more contacts in the `/add-me-up` page.*/
export default function AddWhatsAppNumberModal(
	props: ReturnType<typeof useDisclosure>,
) {
	const { isOpen, onOpenChange } = props;
	const navigate = useNavigate();
	const { register, formState, handleSubmit } = useForm({ mode: "onBlur" });
	const { errors, isSubmitting, isSubmitSuccessful, isDirty } = formState;

	useEffect(() => {
		if (isDirty)
			isSubmitSuccessful
				? navigate("/add-me-up")
				: toast.error(
						"We could not complete your request at this time. Try again soon.",
					);
	}, [formState]);

	return (
		<>
			<Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<ModalBody className="mb-4 p-6">
							<img
								width={150}
								src="/images/What is WhatsApp Business API-The Complete Guide 2024-Karix 1.png"
								className="block mx-auto"
								alt=""
							/>
							<h3 className="font-medium text-lg text-center">
								Add WhatsApp Number
							</h3>
							<p className="text-sm text-zinc-700 text-center">
								Kindly add your WhatsApp number to continue
							</p>
							<form onSubmit={handleSubmit(submitPhoneNumber)}>
								<Input
									label="WhatsApp Number"
									placeholder="Enter your WhatsApp number"
									icon={<InputIcon />}
									{...register("whatsapp_number", {
										required: "Enter your WhatsApp number",
										pattern: phoneNumberValidation,
									})}
									errorMessage={errors.whatsapp_number?.message as string}
								/>
								<button
									type="submit"
									className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
								>
									Continue
								</button>
							</form>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

			{/* Show loading spinner while submitting form */}
			{isSubmitting && <Loading fixed />}
		</>
	);
}

function InputIcon() {
	return (
		<button
			type="button"
			className="flex items-center gap-1 hover:bg-zinc-200 py-1 px-2 rounded-lg transition-all active:scale-95"
		>
			<img src="/images/nigerian-flag.png" width={15} alt="" />
			<ChevronDown size={12} />
		</button>
	);
}
