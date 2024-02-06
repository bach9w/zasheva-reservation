"use client";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { useReservationRooms } from "../hooks";

function getCurrentMonth() {
	const months = [
		"Януари",
		"Февруари",
		"Март",
		"Април",
		"Май",
		"Юни",
		"Юли",
		"Август",
		"Септември",
		"Октомври",
		"Ноември",
		"Декември",
	];

	const currentMonthIndex = new Date().getMonth();
	return months[currentMonthIndex];
}

function generateCurrentMonthReservations() {
	const date = new Date();
	const month = date.getMonth();
	const year = date.getFullYear();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const reservations = [];

	for (let day = 1; day <= daysInMonth; day++) {
		const reservation = {
			day: day.toString().padStart(2, "0"),
			room3Status: "Свободна",
			room4Status: "Свободна",
			room5Status: "Свободна",
			room6Status: "Свободна",
			room7Status: "Свободна",
			room8Status: "Свободна",
			room9Status: "Свободна",
		};

		reservations.push(reservation);
	}

	return reservations;
}

const globalReservations = generateCurrentMonthReservations();

function changeRoomStatus(day: string, room: string, status: string) {
	const reservation = globalReservations.find((res) => res.day === day);

	if (!reservation) {
		throw new Error("Reservation not found");
	}
	const roomStatusKey = room + "Status";

	const typedReservation: { [key: string]: string } = reservation;

	// eslint-disable-next-line no-prototype-builtins
	if (!typedReservation.hasOwnProperty(roomStatusKey)) {
		throw new Error("Room status not found");
	}
	typedReservation[roomStatusKey] = status;
}

function checkStatus(status: string) {
	if (status === "Заета") {
		return <Badge variant="destructive">{status}</Badge>;
	} else {
		return <Badge variant="success">{status}</Badge>;
	}
}

function extractDate(date: string): string {
	const parts = date.split("/");
	return parts[0];
}

function GetData(room: string) {
	const date = new Date();
	const month = date.getMonth();
	const year = date.getFullYear();
	const data = useReservationRooms(room);
	const arrivalDates = data?.map((arrival) => arrival.arivalDate);
	const departureDates = data?.map((departure) => departure.departureDate);
	const extractedArrivalDates = arrivalDates?.map((date) => extractDate(date));
	const extractedDepartureDates = departureDates?.map((date) =>
		extractDate(date),
	);
	if (extractedArrivalDates && extractedDepartureDates) {
		extractedArrivalDates.forEach((arrivalDate, index) => {
			const departureDate = extractedDepartureDates[index];
			const startDate = new Date(year, month, parseInt(arrivalDate, 10));
			const endDate = new Date(year, month, parseInt(departureDate, 10));

			// Генерираме всички дати между пристигане и заминаване
			// eslint-disable-next-line prefer-const
			let currentDate = new Date(startDate);
			while (currentDate.getTime() <= endDate.getTime() - 1) {
				const formattedDate = currentDate.getDate().toString().padStart(2, "0");
				changeRoomStatus(formattedDate, room, "Заета");

				// Преминаваме към следващия ден
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});
	}
}

const CalRes = () => {
	GetData("room3");
	GetData("room4");
	GetData("room5");
	GetData("room6");
	GetData("room7");
	GetData("room8");
	GetData("room9");

	return (
		<div>
			<h1 className="text-center font-bold uppercase bg-red-700">Календар</h1>
			<Table>
				<TableCaption>Резервационен лист</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Ден</TableHead>
						<TableHead className="w-[100px]">Стая 3</TableHead>
						<TableHead className="w-[100px]">Стая 4</TableHead>
						<TableHead className="w-[100px]">Стая 5</TableHead>
						<TableHead className="w-[100px]">Стая 6</TableHead>
						<TableHead className="w-[100px]">Стая 7</TableHead>
						<TableHead className="w-[100px]">Стая 8</TableHead>
						<TableHead className="w-[100px]">Стая 9</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{globalReservations.map((invoice) => (
						<TableRow key={invoice.day}>
							<TableCell className="font-medium">{invoice.day}</TableCell>

							<TableCell>{checkStatus(invoice.room3Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room4Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room5Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room6Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room7Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room8Status)}</TableCell>
							<TableCell>{checkStatus(invoice.room9Status)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={7}>{getCurrentMonth()}</TableCell>
						<TableCell className="text-right">
							{/*<Select>
								<SelectTrigger>
									<SelectValue placeholder="Избери" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Месец</SelectLabel>
										<SelectItem value="jan">Януари</SelectItem>
										<SelectItem value="feb">Февруари</SelectItem>
										<SelectItem value="mar">Март</SelectItem>
										<SelectItem value="apr">Април</SelectItem>
										<SelectItem value="may">Май</SelectItem>
										<SelectItem value="jun">Юни</SelectItem>
										<SelectItem value="jul">Юли</SelectItem>
										<SelectItem value="aug">Август</SelectItem>
										<SelectItem value="sep">Септември</SelectItem>
										<SelectItem value="oct">Октомври</SelectItem>
										<SelectItem value="nov">Ноември</SelectItem>
										<SelectItem value="dec">Декември</SelectItem>
									</SelectGroup>
								</SelectContent>
					</Select>*/}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
};
export default CalRes;
