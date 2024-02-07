"use client";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";

import { api } from "@/convex/_generated/api";
import { useCurrentTeam } from "../hooks";
import { usePaginatedQuery } from "convex/react";

function roomNumber(text: string) {
	if (text === "room3") {
		return "Стая 3";
	} else if (text === "room4") {
		return "Стая 4";
	} else if (text === "room5") {
		return "Стая 5";
	} else if (text === "room6") {
		return "Стая 6";
	} else if (text === "room7") {
		return "Стая 7";
	} else if (text === "room8") {
		return "Стая 8";
	} else if (text === "room9") {
		return "Стая 9";
	} else {
		return "Error";
	}
}

function guestNumber(text: string) {
	if (text === "two") {
		return "Двама";
	} else if (text === "three") {
		return "Трима";
	} else if (text === "four") {
		return "Четирима";
	} else if (text === "five") {
		return "Петима";
	}
}

function isPaid(boolean: boolean) {
	if (boolean) {
		return (
			<Badge className="w-full justify-center" variant="outline">
				Да
			</Badge>
		);
	} else {
		return (
			<Badge className="w-full justify-center" variant="destructive">
				Не
			</Badge>
		);
	}
}

const ListResPage = () => {
	const team = useCurrentTeam();
	const { results: messages } = usePaginatedQuery(
		api.users.teams.messages.list,
		team == null ? "skip" : { teamId: team._id },
		{ initialNumItems: 10 },
	);

	return (
		<div>
			<h1 className="text-center font-bold uppercase bg-red-700">Списък</h1>
			<Table>
				<TableCaption>Резервации</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Име</TableHead>
						<TableHead>Стая</TableHead>
						<TableHead>Дата на настаняване</TableHead>
						<TableHead>Дата на напускане</TableHead>
						<TableHead>Платено</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{messages.map((message) => (
						<TableRow key={message._id}>
							<TableCell className="text-center w-1/5">
								{message.text}
							</TableCell>
							<TableCell className="text-center w-1/5">
								<Accordion type="multiple" orientation="vertical">
									<AccordionItem key={message._id} value={message._id}>
										<AccordionTrigger>
											{roomNumber(message.roomNumber)}
										</AccordionTrigger>
										<AccordionContent>
											{guestNumber(message.numberOfGuests)}
											<br />
											Забележка:
											{message.note}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</TableCell>
							<TableCell className="text-center w-1/5">
								{message.arivalDate}
							</TableCell>
							<TableCell className="text-center w-1/5">
								{message.departureDate}
							</TableCell>
							<TableCell className="text-center w-1/5">
								<Accordion type="multiple">
									<AccordionItem key={message._id} value={message._id}>
										<AccordionTrigger>
											{isPaid(message.isPaid)}
										</AccordionTrigger>
										<AccordionContent>
											Повече информация
											<br /> Booking - {message.isBooking ? "Да" : "Не"}
											<br />
											Сума за плащане - {message.priceToCollect} лв.
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
export default ListResPage;
