import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { Link } from "react-router";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";

export default function EarnByResellingModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { innerWidth } = useWindowDimensions();

	useEffect(() => {
		onOpen();
	}, [onOpen]);

	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			scrollBehavior={innerWidth < 640 ? "inside" : "outside"}
		>
			<ModalContent>
				{() => (
					<ModalBody className="space-y-3 pb-4">
						<div>
							<img
								src="/images/7_Places_To_Shop_Online_On_A_Budget-removebg-preview 1.png"
								alt=""
								className="block mx-auto"
								width={280}
							/>
							<h4 className="font-semibold text-sm text-center">
								Resell Products for High Commissions
							</h4>
							<p className="text-sm text-[#5E5E62] font-light max-w-[399px] mx-auto text-center">
								Leverage our wide-ranging catalog of high-demand products to
								earn big commissions. Start reselling today and watch your
								income grow effortlessly!
							</p>
						</div>

						<div className="bg-[#F7F8FF] space-y-2 rounded-3xl p-2">
							<p className="font-medium text-center text-[9.16px]">
								Getting Started is Easy
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div>
									<div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#3F3F3F] rotate-12 text-center">
										1.
									</div>
									<p className="text-[9.16px]">Browse the Product Catalog:</p>
									<ul className="list-disc ml-4 text-sm text-[9.16px] font-light text-[#5E5E62]">
										<li>
											Explore our curated collection of trending products and
											services. Choose items with the highest earning potential.
										</li>
									</ul>
								</div>

								<div>
									<div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#3F3F3F] rotate-12 text-center">
										2.
									</div>
									<p className="text-[9.16px]">
										Share Your Unique Affiliate Link:
									</p>
									<ul className="list-disc ml-4 text-sm text-[9.16px] font-light text-[#5E5E62]">
										<li>
											Use our easy-to-generate reseller links to share products
											on your social media platforms, WhatsApp, or personal
											networks.
										</li>
									</ul>
								</div>

								<div>
									<div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#3F3F3F] rotate-12 text-center">
										3.
									</div>
									<p className="text-[9.16px]">Earn Commissions on Sales:</p>
									<ul className="list-disc ml-4 text-sm text-[9.16px] font-light text-[#5E5E62]">
										<li>
											Receive instant earnings every time a customer makes a
											purchase using your link.
										</li>
									</ul>
								</div>
							</div>
						</div>
						<Link
							to="/earn/resell"
							className="p-[9.16px] rounded-[11.45px] text-[9.16px] transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
						>
							Start Reselling Now
						</Link>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
