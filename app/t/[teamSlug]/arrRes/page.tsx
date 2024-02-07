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
import { useDayRes } from "../hooks";
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

function getCurrentDate() {
	const date = new Date();
	return date.getDate();
}

function getFullDate() {
	const date = new Date();
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
	const year = String(date.getFullYear());
	const formattedDate = `${day}/${month}/${year}`;
	return formattedDate;
}

function splitDate(date: string) {
	const parts = date.split("/");
	const day = parts[0];
	return day;
}

const ArrRes = () => {
	const team = useCurrentTeam();
	const messages = useDayRes(getFullDate().toString());

	const today = getCurrentDate();
	const formattedToday = today.toString().padStart(2, "0");

	return (
		<div>
			<h1 className="text-center font-bold uppercase bg-red-700">
				Настаняване за деня <br /> {getFullDate()}
			</h1>

			<Table>
				<TableCaption>Резервации</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Име</TableHead>
						<TableHead>Стая</TableHead>

						<TableHead>Платено</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{messages &&
						messages.map((message) => (
							<TableRow key={message._id}>
								<TableCell className="text-center w-1/3">
									{message.text}
								</TableCell>
								<TableCell className="text-center w-1/3">
									<Accordion type="multiple" orientation="vertical">
										<AccordionItem key={message._id} value={message._id}>
											<AccordionTrigger>
												{roomNumber(message.roomNumber)}
											</AccordionTrigger>
											<AccordionContent>
												{guestNumber(message.numberOfGuests)}
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</TableCell>

								<TableCell className="text-center w-1/3">
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
export default ArrRes;
