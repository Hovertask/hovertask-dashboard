import { useDispatch, useSelector } from "react-redux";
import type { AuthUserDTO, Task } from "../../types";
import { ChevronDown, DollarSign, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { setTasks } from "../redux/slices/tasks";
import getTasks from "../utils/getTasks";
import Loading from "./_shared/components/Loading";
import TaskCard from "../components/TaskCard";
import useProducts from "../hooks/useProducts";
import EmptyMapErr from "./_shared/components/EmptyMapErr";
import sendVerificationEmail from "../utils/sendVerificationEmail";
import useDraggable from "../hooks/useDraggable";
import cn from "../utils/cn";
import HorizontalLine from "../components/HorizontalLine";
import Input from "./_shared/components/Input";
import { useForm } from "react-hook-form";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import { toast } from "sonner";
import getAuthUser from "../utils/getAuthUser";
import { setAuthUser } from "../redux/slices/auth";

export default function Dashboard() {
	const authUser = useSelector<any, AuthUserDTO>((state) => state.auth.value);

	return (
		<div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
			<div className="px-4 py-6 space-y-10 bg-white shadow min-h-full max-w-full overflow-x-hidden">
				<Greeting
					lname={authUser.lname}
					how_you_want_to_use={authUser.how_you_want_to_use}
				/>
				<BalanceBoard balance={authUser.balance} />
				<WelcomeMessage />
				<AvailableTasks />
				<Carousel>
					<img src="/images/Group 1000004390.png" alt="" />
					<img src="/images/Group 1000004393.png" alt="" />
					<img src="/images/Group 1000004395.png" alt="" />
				</Carousel>
				<AdBanner />
				<PopularProducts />
				{authUser.email_verified_at && <BecomeMemberModal />}
				{authUser.email_verified_at && <AddMeUpModal />}
			</div>
		</div>
	);
}

function Greeting({
	lname,
	how_you_want_to_use,
}: { lname?: string; how_you_want_to_use?: string }) {
	return (
		<div className="flex justify-between">
			<h1 className="text-xl">
				Welcome back, <br />
				<span className="capitalize font-medium">{lname}</span>
			</h1>
			<button className="bg-[#10AF88] text-white py-1.5 px-3 rounded-lg inline-flex items-center gap-2 text-sm h-fit">
				<DollarSign size={14} />{" "}
				<span className="capitalize">{how_you_want_to_use}</span>{" "}
				<span style={{ fontSize: 16 }} className="material-icons-outlined">
					arrow_drop_down
				</span>
			</button>
		</div>
	);
}

function BalanceBoard({ balance }: { balance?: number }) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-lg">Total Balance</span>
				<button className="flex items-center gap-1 px-3 py-1 border-b rounded-full border-gray-600 text-xs">
					This Week
					<span style={{ fontSize: 16 }} className="material-icons-outlined">
						arrow_drop_down
					</span>
				</button>
			</div>

			<div className="flex items-center gap-12 flex-wrap">
				<div className="text-2xl font-semibold">
					₦{balance?.toFixed(2).toLocaleString()}
				</div>
				<div className="flex gap-2 text-sm flex-wrap">
					<Link
						to="/fund-wallet"
						className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-full hover:bg-primary/80 transition-colors"
					>
						<Wallet size={16} /> Fund
					</Link>
					<Link
						to="/withdraw"
						className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-full transition-colors hover:bg-primary/10"
					>
						<Wallet size={16} /> Withdraw
					</Link>
				</div>
			</div>

			<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-gradient-to-b from-white to-primary/10 p-8 py-12 rounded-2xl shadow">
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<span className="font-medium">Earned</span>
						<button className="flex items-center gap-1 px-3 py-1 border-b rounded-full border-gray-600 text-xs">
							This Week
							<span
								style={{ fontSize: 16 }}
								className="material-icons-outlined"
							>
								arrow_drop_down
							</span>
						</button>
					</div>
					<p className="text-xl font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<HorizontalLine />

				<div className="space-y-3">
					<p className="font-medium">Pending</p>
					<p className="text-xl font-medium">
						₦{balance?.toFixed(2).toLocaleString()}
					</p>
				</div>

				<HorizontalLine />

				<div className="space-y-3">
					<p className="font-medium">Spent</p>
					<p className="text-xl font-medium">
						₦ {balance?.toFixed(2).toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}

function WelcomeMessage() {
	const authUser = useSelector<any, AuthUserDTO>((state) => state.auth.value);
	const dispatch = useDispatch();

	async function verifyAccountVerification() {
		const authUser: AuthUserDTO = await getAuthUser();
		authUser.email_verified_at &&
			(toast.success("Account verified successfully!"),
			dispatch(setAuthUser(authUser)));
	}

	// useEffect(() => {
	// 	let interval: number;

	// 	interval = setInterval(() => {
	// 		if (!authUser.email_verified_at) verifyAccountVerification();
	// 		else clearInterval(interval);
	// 	}, 3000);

	// 	return () => clearInterval(interval);
	// }, [authUser]);

	return authUser.email_verified_at ? (
		<div className="text-center text-sm space-y-2">
			<h2 className="text-xl font-medium text-success">
				Welcome To The Website
			</h2>
			<p>
				Your membership has been successfully activated. Start earning daily by
				posting adverts and completing tasks on your social media accounts.
			</p>
		</div>
	) : (
		<div className="text-center text-sm space-y-2">
			<h2 className="text-lg font-medium">Welcome To The Website</h2>
			<p>
				Earn by completing simple social media tasks or advertise your products
				to the right audience. Kindly verify your account
			</p>
			<button
				onClick={async () => sendVerificationEmail(authUser.email)}
				className="text-danger underline hover:bg-danger/20 px-4 py-1.5 rounded-full block w-fit mx-auto"
			>
				Kindly Verify Your Account
			</button>
			<p>
				Get access to all the services with just ₦1,000{" "}
				<span className="font-medium">ONLY</span> verify your account now!
			</p>
		</div>
	);
}

function AvailableTasks() {
	const tasks = useSelector<any, Task[] | null>(
		(state: any) => state.tasks.value,
	);
	const [tasksFetchStatus, setTaskFetchStatus] = useState<
		"pending" | "done" | "failed"
	>("pending");
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			try {
				if (tasks === null) dispatch(setTasks(await getTasks()));
				setTaskFetchStatus("done");
			} catch {
				setTaskFetchStatus("failed");
			}
		})();
	}, []);

	return (
		<div className="space-y-3">
			<h2 className="text-xl font-medium">New Available Tasks</h2>

			{tasksFetchStatus === "pending" && <Loading />}
			{tasksFetchStatus === "done" && (
				<div className="space-y-4">
					{tasks?.length ? (
						tasks
							?.slice(4)
							.map((task) => <TaskCard {...task} key={task.user_id} />)
					) : (
						<div className="text-center flex flex-col items-center">
							<img src="/images/iconoir_info-empty.png" width={80} alt="" />
							<p>There are no tasks available at the moment</p>
						</div>
					)}
				</div>
			)}

			{tasks?.length && (
				<Link
					to="/earn/tasks"
					className="block w-fit mx-auto px-4 py-2 rounded-full border border-primary text-sm text-primary transition-colors hover:bg-primary/20"
				>
					See all tasks
				</Link>
			)}
		</div>
	);
}

function PopularProducts() {
	const { products, reload } = useProducts();
	const productsContainer = useRef<HTMLDivElement>(null);
	const { isDragging } = useDraggable(productsContainer);

	return (
		<div className="space-y-3">
			<h2 className="text-lg font-medium">Popular Products</h2>

			{products ? (
				products.length > 0 ? (
					<div
						ref={productsContainer}
						className={cn(
							"flex gap-4 overflow-x-auto bg-primary/30 p-4 rounded-3xl w-full",
							{
								"cursor-grabbing": isDragging,
								"cursor-grab": !isDragging,
							},
						)}
					>
						{products.map((product) => (
							<ProductCard
								{...product}
								key={product.name}
								version="bordered"
								buttonText="Check Product"
							/>
						))}
					</div>
				) : (
					<EmptyMapErr
						description="No products are available yet"
						buttonInnerText="Reload Products"
						onButtonClick={reload}
					/>
				)
			) : (
				<Loading />
			)}
		</div>
	);
}

function AdBanner() {
	return (
		<div className="relative">
			<img src="/images/buy-sell-bg.png" alt="" />
			<p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-white text-center">
				Buy & Sell With Ease
			</p>
		</div>
	);
}

function BecomeMemberModal() {
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	useEffect(() => {
		onOpen(); // Auto open modal.
	}, []);

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

function AddMeUpModal() {
	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
	const addWhatsAppModalProps = useDisclosure();

	useEffect(() => {
		onOpen(); // Auto open modal.
	}, []);

	return (
		<>
			<Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<ModalBody className="mb-4">
							<img
								width={150}
								src="/images/_WhatsApp_tiene_un_nuevo_diseño_y_así_lo_puedes_descargar_-removebg-preview 1.png"
								className="block mx-auto"
								alt=""
							/>
							<h3 className="font-medium text-lg text-center">
								Need More WhatsApp Contacts or Viewers? Got You
							</h3>
							<p className="text-sm text-zinc-700 text-center">
								Add new friends, rack up points and get your profile listed for
								others to add you back
							</p>
							<button
								onClick={() => (onClose(), addWhatsAppModalProps.onOpen())}
								className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
							>
								Continue
							</button>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

			{/* When the user clicks on the `Continue` button, this modal opens. */}
			<AddWhatsAppNumberModal {...addWhatsAppModalProps} />
		</>
	);
}

function AddWhatsAppNumberModal(props: ReturnType<typeof useDisclosure>) {
	const { isOpen, onOpenChange } = props;
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const {
		register,
		formState: { errors, isValid },
		getValues,
	} = useForm({ mode: "onBlur" });

	function submitPhoneNumber() {
		if (isValid) {
			setIsLoading(true);

			fetch(apiEndpointBaseURL + "/addmeup/create", {
				method: "post",
				body: JSON.stringify(getValues()),
				headers: {
					authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					"content-type": "application/json",
				},
			})
				.then((response) => {
					if (response.ok)
						navigate("/add-me-up"),
							toast.success("WhatsApp number added successfully!");
					else throw new Error("Request failed!");
				})
				.catch((error) =>
					toast.error(
						error.message || "An unknown error occurred. Please try again.",
					),
				)
				.finally(() => setIsLoading(false));
		}
	}

	return (
		<>
			<Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<ModalBody className="mb-4 p-6">
							<img
								width={150}
								src="/images/What is WhatsApp Business API -The Complete Guide 2024 - Karix 1.png"
								className="block mx-auto"
								alt=""
							/>
							<h3 className="font-medium text-lg text-center">
								Add WhatsApp Number
							</h3>
							<p className="text-sm text-zinc-700 text-center">
								Kindly add your WhatsApp number to continue
							</p>
							<Input
								label="WhatsApp Number"
								placeholder="Enter your WhatsApp number"
								icon={
									<button
										type="button"
										className="flex items-center gap-1 hover:bg-zinc-200 py-1 px-2 rounded-lg transition-all active:scale-95"
									>
										<img src="/images/nigerian-flag.png" width={15} alt="" />
										<ChevronDown size={12} />
									</button>
								}
								{...register("whatsapp_number", {
									required: "Enter your WhatsApp number",
									pattern: {
										value: /^\+?\d{8,16}$/,
										message: "Enter a valid number",
									},
								})}
								errorMessage={errors.whatsapp_number?.message as string}
							/>
							<button
								onClick={submitPhoneNumber}
								className="p-2 rounded-xl text-sm transition-all bg-primary text-white active:scale-95 block w-fit mx-auto"
							>
								Continue
							</button>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>
			{isLoading && <Loading fixed />}
		</>
	);
}
