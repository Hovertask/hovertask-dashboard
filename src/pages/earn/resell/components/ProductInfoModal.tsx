import {
	Modal,
	ModalBody,
	ModalContent,
	type useDisclosure,
} from "@heroui/react";
import { Link } from "react-router";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import type { Product } from "../../../../../types.d";

export default function ProductInfoModal(
	props: ReturnType<typeof useDisclosure> & { product?: Product },
) {
	const { innerWidth } = useWindowDimensions();

	return (
		<Modal
			size="2xl"
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			onClose={props.onClose}
			scrollBehavior={innerWidth > 640 ? "outside" : "inside"}
		>
			<ModalContent>
				{() => (
					<ModalBody className="space-y-4 pb-4">
						<div>
							<h3 className="text-xl font-medium">{props.product?.name}</h3>
							<p>{props.product?.description}</p>
						</div>

						<hr />

						<div className="grid grid-cols-3 items-center gap-2">
							<div className="col-span-2 text-sm space-y-4">
								<p>
									To start reselling this product, simply click the button below
									to generate your unique reseller link. This personalized link
									will track all your sales for this specific product.
								</p>

								<p>
									<span className="font-medium">Commission Details:</span>{" "}
									<br />
									You will earn a reseller commission of ₦10,000 every time
									someone purchases this product using your unique link.
								</p>

								<p>
									<span className="font-medium">Take Action Now!</span> <br />
									Click the button bellow and start earning today.
								</p>
							</div>
							<div>
								<img src={props.product?.images[0]} alt="" />
							</div>
						</div>

						<div className="gap-4 text-sm flex items-center">
							<button
								type="button"
								className="bg-primary p-2 rounded-xl text-white transition-transform active:scale-95"
							>
								Generate Reseller Link
							</button>
							<Link
								className="bg-primary p-2 rounded-xl text-white transition-transform active:scale-95"
								to={`/earn/resell/buy-product/${props.product?.id}`}
							>
								Buy Product
							</Link>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
