import { Link } from "react-router";
import menu from "../utils/menu";
import cn from "../utils/cn";
import type { MenuDropdownProps } from "../../types";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import useActiveLink from "../hooks/useActiveLink";

export default function SideNav() {
	const activeLink = useActiveLink();
	const updatedMenu = menu.map((menuItem) => {
		if (menuItem.label === "Buy Followers") {
			menuItem.path = menuItem.basePath;
		}

		return menuItem;
	});

	return (
		<div className="max-w-[243px] space-y-8 text-sm">
			<div className="bg-primary py-20 pl-6 rounded-3xl text-white">
				<div className="border-1 border-[#FFFFFF33] pl-4 pr-2 py-10 rounded-2xl space-y-3">
					{updatedMenu.map((menuItem) => {
						return menuItem.options ? (
							<MenuOptionDropdown key={menuItem.label} {...menuItem} />
						) : (
							<Link
								className={cn(
									"flex items-center gap-3 px-3 py-1.5 rounded-xl w-fit",
									{
										"bg-white text-primary": activeLink === menuItem.path,
									},
								)}
								key={menuItem.label}
								to={menuItem.path}
							>
								{menuItem.icon} {menuItem.label}
							</Link>
						);
					})}
				</div>
			</div>

			<div className="space-y-4 p-6">
				<Link
					className="border-1 border-zinc-400 rounded-2xl p-4 block"
					to="/marketplace"
				>
					<img
						src="/images/Online_Shopping_Concept__Mobile_Phone_or_Smartphone_with_Cart_an_Stock_Illustration_-_Illustration_of_price__internet__60305985-removebg-preview 1.png"
						alt=""
					/>
					<h5 className="font-medium">Explore Our Marketplace</h5>
					<p className="text-xs">
						Buy and sell products and services effortlessly. Connect with
						trusted sellers and buyers to meet your needs today!
					</p>
				</Link>
				<Link
					className="border-1 border-zinc-400 rounded-2xl p-4 block"
					to="/earn/resell"
				>
					<img
						src="/images/Illustration_of_Nigerian_naira_notes_inside_mobile_phone_isolated_on_transparent_background-removebg-preview 1.png"
						alt=""
					/>
					<h5 className="font-medium">Earn By Reselling Products</h5>
					<p className="text-xs">
						Choose high-demand products and enjoy attractive commissions
					</p>
				</Link>
			</div>
		</div>
	);
}

function MenuOptionDropdown(props: MenuDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const activeLink = useActiveLink();

	useEffect(() => {
		document.body.style.overflowY = isOpen ? "hidden" : "auto";
	}, [isOpen]);

	return (
		<div aria-haspopup="menu" className="relative">
			<div
				className={cn("flex items-center w-fit rounded-xl", {
					"bg-white text-primary": activeLink === props.basePath,
				})}
			>
				<Link
					to={props.basePath}
					className={cn("flex items-center gap-2 px-3 py-1.5 w-fit")}
				>
					{props.icon} {props.label}
				</Link>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						"flex items-center transition-all active:scale-90 px-2",
						{
							"rotate-180": isOpen,
						},
					)}
				>
					<ChevronDown size={13} />
				</button>
			</div>

			{isOpen && (
				<div
					className="fixed inset-0"
					onClick={() => setIsOpen(false)}
					onKeyDown={() => setIsOpen(false)}
				/>
			)}

			<div
				aria-live="polite"
				className={cn(
					"absolute [top:calc(100%+2px)] p-2 rounded-xl bg-white text-black text-xs transition-all [transform-origin:_top] z-10",
					{
						"opacity-0 overflow-hidden scale-0": !isOpen,
					},
				)}
			>
				{props.options.map((option) => (
					<Link
						key={option.label}
						onClick={() => setIsOpen(false)}
						className={cn("flex items-center gap-3 px-3 py-1.5 rounded-xl", {
							"bg-primary text-white": option.path === activeLink,
							"hover:text-primary": option.path !== activeLink,
						})}
						to={option.path}
					>
						{option.icon} {option.label}
					</Link>
				))}
			</div>
		</div>
	);
}
