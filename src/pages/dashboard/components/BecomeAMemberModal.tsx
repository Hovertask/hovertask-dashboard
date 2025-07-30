import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { AuthUserDTO } from "../../../../types";

/** Prompts user to subscribe on the platform. */
export default function BecomeMemberModal() {
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const isMember = useSelector<{ auth: { value: AuthUserDTO } }, boolean>(
		(state) => state.auth.value.is_member,
	);

	useEffect(() => {
		!isMember && !sessionStorage.hasShownMembershipModal && onOpen();
		sessionStorage.hasShownMembershipModal = true;
	}, [onOpen, isMember]);

	return (
		<Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{() => (
					<ModalBody className="mb-4">
						<img
							width={150}
							src="/images/Media_Sosial_Pictures___Freepik-removebg-preview 2.png"
							className="block mx-auto"
							alt=""
						/>
						<h3 className="font-medium text-lg text-center">
							Get Paid For Posting Adverts and Engaging on Your Social Media
						</h3>
						<p className="text-sm text-zinc-700 text-center">
							Earn steady income by reselling products and posting adverts,
							performing social media engaging tasks for businesses and top
							brands on your social media account
						</p>
						<Link
							to="/become-a-member"
							className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
						>
							Become a Member
						</Link>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
