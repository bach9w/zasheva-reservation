"use client";

import { MessageBoard } from "@/app/t/[teamSlug]/MessageBoard";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";

export default function Home() {
	const team = useCurrentTeam();
	if (team == null) {
		return null;
	}
	return (
		<>
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-4xl font-extrabold">РЕЗЕРВАЦИИ</h1>
			</div>

			<MessageBoard />
		</>
	);
}
