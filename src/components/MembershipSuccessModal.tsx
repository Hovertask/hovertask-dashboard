import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Link } from "react-router";

export default function MembershipSuccessModal({}) {
	return (
		<Modal>
			<ModalContent>
				{(/* onClose: () => any */) => (
					<ModalBody>
						<div>
							<img src="/images/animated-checkmark.gif" alt="" />
							<h3>Congratulation! You Are Now A Memeber!</h3>
							<p>
								Your membership has been successfully activated. Start earning
								daily by posting adverts and complettings tasks on your social
								media accounts.
							</p>
							<p>
								Click the botton below to generate your next task and begin
								earning. <br /> The more tasks you complete, the more you earn.
							</p>
							<div>
								<Link to="/earn/tasks/1">Perform Task</Link>
								<Link to="/">Go to Dashboard</Link>
							</div>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
