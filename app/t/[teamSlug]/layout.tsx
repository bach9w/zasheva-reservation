import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { AcceptInviteDialog } from "@/app/t/AcceptInviteDialog";
import { Notifications } from "@/app/t/Notifications";
import { TeamMenu } from "@/app/t/TeamMenu";
import { ProfileButton } from "@/app/t/[teamSlug]/ProfileButton";
import { StickyHeader } from "@/components/layout/sticky-header";
import { TeamSwitcher } from "@/app/t/TeamSwitcher";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { ResponsiveSidebarButton } from "@/components/layout/responsive-sidebar-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StickySidebar } from "@/components/layout/sticky-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense>
			<ConvexClientProvider>
				<StickyHeader className="p-2 flex items-center justify-between h-[3.25rem]">
					<ResponsiveSidebarButton className=""></ResponsiveSidebarButton>

					<TeamSwitcher />
					<div className="flex items-center gap-4">
						<Notifications />
						<ProfileButton />
					</div>
				</StickyHeader>

				{children}
				<AcceptInviteDialog />
				<Toaster />
			</ConvexClientProvider>
		</Suspense>
	);
}
