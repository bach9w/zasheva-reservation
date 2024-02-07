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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

import { api } from "@/convex/_generated/api";
import { useCurrentTeam } from "../hooks";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

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
		{ initialNumItems: 20 },
	);
	const deleteBooking = useMutation(api.users.teams.messages.deleteBooking);
	const { toast } = useToast();

	function onDelete(_id: string) {
		void deleteBooking({ _id: _id }).then(() => {
			toast({
				title: "Успешно",
				description: "Резервацията беше анулирана",
				variant: "destructive",
			});
		});
	}

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
								<Accordion type="multiple" orientation="vertical">
									<AccordionItem key={message._id} value={message._id}>
										<AccordionTrigger>{message.text}</AccordionTrigger>
										<AccordionContent>
											<AlertDialog>
												<AlertDialogTrigger>
													<Button variant="destructive">
														Анулирай резервация
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Информация</AlertDialogTitle>
													</AlertDialogHeader>
													<AlertDialogDescription className="text-center">
														Име - {message.text}
														<Separator />
														Дата на настаняване - {message.arivalDate}
														<Separator />
														Дата на напускане - {message.departureDate}
													</AlertDialogDescription>
													<AlertDialogFooter className="flex gap-2">
														<AlertDialogAction
															onClick={() => onDelete(message._id)}
														>
															Анулирай
														</AlertDialogAction>
														<AlertDialogAction>Затвори</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</TableCell>
							<TableCell className="text-center w-1/5">
								<Accordion type="multiple" orientation="vertical">
									<AccordionItem key={message._id} value={message._id}>
										<AccordionTrigger>
											{roomNumber(message.roomNumber)}
										</AccordionTrigger>
										<AccordionContent>
											{guestNumber(message.numberOfGuests)}
											<Separator />
											Забележка:
											{message.note}
											<Separator />
											Резервацията е направена от <br />
											<Badge className="justify-center" variant="outline">
												{message.author}
											</Badge>
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
											<Separator /> Booking - {message.isBooking ? "Да" : "Не"}
											<Separator />
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
