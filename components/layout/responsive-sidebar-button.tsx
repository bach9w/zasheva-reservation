"use client";

import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { fr } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { set } from "date-fns";

// Pass the sidebar displayed when the button is clicked as children
export const ResponsiveSidebarButton = fr<HTMLButtonElement, ButtonProps>(
	function ResponsiveSidebarButton({ children, ...props }, ref) {
		const [showSidebar, setShowSidebar] = useState(false);

		return (
			<>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowSidebar(!showSidebar)}
					ref={ref}
					{...props}
				>
					{showSidebar ? (
						<Cross2Icon className="h-6 w-6" />
					) : (
						<HamburgerMenuIcon className="h-6 w-6" />
					)}
				</Button>
				{showSidebar ? (
					<RemoveScroll as={Slot} allowPinchZoom enabled>
						<div className=" fixed w-auto top-[calc(3.25rem+1px)] h-[calc(100vh-(3.25rem+1px))]">
							<div className="flex flex-col">
								<NavLink onClick={() => setShowSidebar(false)} relativeHref="">
									Добави
								</NavLink>
								<NavLink
									onClick={() => setShowSidebar(false)}
									relativeHref="/listRes"
								>
									Резервации
								</NavLink>
								<NavLink
									onClick={() => setShowSidebar(false)}
									relativeHref="/calRes"
								>
									Календар
								</NavLink>
								<NavLink
									onClick={() => setShowSidebar(false)}
									relativeHref="/arrRes"
								>
									Пристигащи
								</NavLink>

								<NavLink
									onClick={() => setShowSidebar(false)}
									relativeHref="/settings"
								>
									Настройки
								</NavLink>
							</div>
						</div>
					</RemoveScroll>
				) : null}
			</>
		);
	},
);

function NavLink({
	relativeHref,
	children,
	onClick,
}: {
	relativeHref: string;
	children: ReactNode;
	onClick?: () => void;
}) {
	const currentPath = usePathname();
	const { teamSlug } = useParams();
	const linkPath = `/t/${teamSlug as string}${relativeHref}`;
	const active =
		relativeHref === ""
			? currentPath === linkPath
			: currentPath.startsWith(linkPath);
	return (
		<Link
			href={linkPath}
			className={cn(
				"text-sm rounded-md bg-background px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
				active ? "text-foreground" : "text-foreground/60",
			)}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}
