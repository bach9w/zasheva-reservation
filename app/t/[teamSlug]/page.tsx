"use client";

import { MessageBoard } from "@/app/t/[teamSlug]/MessageBoard";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";

export default function Home() {
	const team = useCurrentTeam();
	if (team == null) {
		return null;
	}
	return (
		<main className="container">
			<h1 className="text-4xl font-extrabold my-8">{team.name}</h1>
			<p>Поле за добавяне на резервация</p>

			<MessageBoard />
		</main>
	);
}
