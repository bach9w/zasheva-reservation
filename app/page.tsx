import { DashboardButtons } from "@/app/DashboardButtons";
import { StickyHeader } from "@/components/layout/sticky-header";
import { Link } from "@/components/typography/link";
import { Suspense } from "react";

export default function Home() {
	return (
		<>
			<StickyHeader className="px-4 py-2">
				<div className="flex justify-between items-center">
					<span>Viem-stroy</span>
					<Suspense>
						<DashboardButtons />
					</Suspense>
				</div>
			</StickyHeader>
			<main className="container max-w-2xl flex flex-col gap-8 text-center">
				<h1 className="text-4xl font-extrabold my-8 text-center leading-relaxed">
					VIEM-STROY
				</h1>
				<p>Система за контрол на обекти</p>
				<hr />

				<p>
					The frontend is powered by{" "}
					<Link href="https://zash.ltd" target="_blank">
						Zash ltd
					</Link>
					.
				</p>
			</main>
		</>
	);
}
