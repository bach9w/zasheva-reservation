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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useReservationRooms } from "../hooks";
import { getReservationInfo } from "../hooks";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiBook } from "react-icons/fi";

import { AiOutlineFieldNumber } from "react-icons/ai";

function getMonthNames(): string[] {
	return [
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
}

function generateCurrentMonthReservations(month: number) {
	const year = new Date().getFullYear();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const reservations = [];
	for (let day = 1; day <= daysInMonth; day++) {
		const reservation = {
			day: day.toString().padStart(2, "0"),
			room3Status: "F",
			room4Status: "F",
			room5Status: "F",
			room6Status: "F",
			room7Status: "F",
			room8Status: "F",
			room9Status: "F",
		};
		reservations.push(reservation);
	}
	return reservations;
}

let globalReservations = generateCurrentMonthReservations(
	new Date().getMonth(),
);

function changeRoomStatus(day: string, room: string, status: string) {
	// Намираме индекса на резервацията, която искаме да променим
	const reservationIndex = globalReservations.findIndex(
		(res) => res.day === day,
	);

	if (reservationIndex === -1) {
		throw new Error("Reservation not found");
	}

	const reservation = globalReservations[reservationIndex];
	const roomStatusKey = room + "Status";

	if (!(roomStatusKey in reservation)) {
		throw new Error("Room status not found");
	}

	// Създаваме нов обект за резервацията с променения статус, използвайки имутабилност
	const updatedReservation = {
		...reservation,
		[roomStatusKey]: status,
	};

	// Актуализираме глобалния масив с новата резервация, също така по имутабилен начин
	globalReservations = [
		...globalReservations.slice(0, reservationIndex),
		updatedReservation,
		...globalReservations.slice(reservationIndex + 1),
	];
}
function checkStatus(status: string) {
	if (status === "X") {
		return <Badge variant="destructive">{status}</Badge>;
	} else {
		return <Badge variant="success">{status}</Badge>;
	}
}

function GetData(room: string, month: number) {
	const currentDate = new Date();
	const currentMonth = month; // Месецът се връща като число от 0 до 11
	const currentYear = currentDate.getFullYear();

	const data = useReservationRooms(room);

	// Помощна функция за извличане на обект Date от зададен стринг
	function parseDateFromString(dateStr: string): Date {
		const [day, month, year, time] = dateStr.split("/");
		const [hours, minutes] = time.split(":");
		return new Date(
			parseInt(year),
			parseInt(month) - 1,
			parseInt(day),
			parseInt(hours),
			parseInt(minutes),
		);
	}

	// Филтрирайте и сортирайте резервациите за текущия месец
	const reservationsForCurrentMonth = data
		?.filter(
			(reservation) =>
				parseDateFromString(reservation.arivalDate).getMonth() ===
					currentMonth &&
				parseDateFromString(reservation.arivalDate).getFullYear() ===
					currentYear,
		)
		.map((reservation) => ({
			arrivalDate: parseDateFromString(reservation.arivalDate),
			departureDate: parseDateFromString(reservation.departureDate),
			cleaned: reservation.isCleaned,
		}))
		.sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());

	if (!reservationsForCurrentMonth?.length) return;

	reservationsForCurrentMonth.forEach((reservation) => {
		for (
			let date = new Date(reservation.arrivalDate);
			date <= reservation.departureDate;
			date.setDate(date.getDate() + 1)
		) {
			const formattedDate = date.getDate().toString().padStart(2, "0");

			// Проверка и актуализация на статуса на стаята за всяка дата
			changeRoomStatus(formattedDate, room, reservation.cleaned ? "F" : "X");
		}
	});
}

type ReservationInfo = {
	status: string;
	room: string;
	date: string;
};

function roomName(room: string) {
	switch (room) {
		case "room3":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 3
				</div>
			);
		case "room4":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 4
				</div>
			);
		case "room5":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 5
				</div>
			);
		case "room6":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 6
				</div>
			);
		case "room7":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 7
				</div>
			);
		case "room8":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 8
				</div>
			);
		case "room9":
			return (
				<div className="flex justify-center items-center">
					<AiOutlineFieldNumber /> 9
				</div>
			);
		default:
			return "Стая";
	}
}

const SpringModal = ({
	isOpen,
	setIsOpen,
	reservationInfo,
}: {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	reservationInfo: ReservationInfo;
}) => {
	const data = getReservationInfo(reservationInfo.room, reservationInfo.date);
	const arrivalDates = data?.arivalDate;

	const departureDates = data?.departureDate;
	const guestName = data?.text;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
				>
					<motion.div
						initial={{ scale: 0, rotate: "12.5deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className="bg-gradient-to-br from-green-600 to-red-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
					>
						<div className="relative z-10">
							<div className="bg-white justify-center items-center h-16 mb-2 rounded-full font-bold uppercase flex text-3xl text-indigo-600 w-full  ">
								<FiAlertCircle />
								Резервация
							</div>

							<div className="">
								<p className="text-center mb-6">
									Състояние - {reservationInfo.status}
								</p>
								<p className="text-center mb-6 flex justify-center">
									Стая - {roomName(reservationInfo.room)}
								</p>
								{data && (
									<div>
										<p className="text-center mb-6">
											Име на гост - {guestName}
										</p>
										<p className="text-center mb-6">
											Дата на напускане - {departureDates}
										</p>
									</div>
								)}
								{!data && (
									<div className="items-center mb-6 flex justify-center">
										Стаята е свободна
									</div>
								)}
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => setIsOpen(false)}
									className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
								>
									Промени
								</button>
								<button
									onClick={() => setIsOpen(false)}
									className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
								>
									Изход
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const CalRes = () => {
	const [change, setChange] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedInfo, setSelectedInfo] = useState({
		date: "",
		room: "",
		status: "" as any,
	});

	const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
	const lmonth = new Date().getMonth().toString().padStart(2, "0");
	const [cMonth, setCMonth] = useState(parseInt(lmonth, 10));
	const [isClient, setIsClient] = useState(false);
	const monthNames = getMonthNames();

	useEffect(() => {
		setIsClient(true);
		if (change) {
			setChange(false);
			globalReservations = generateCurrentMonthReservations(cMonth);
		}
	}, [cMonth]);

	GetData("room3", cMonth);
	GetData("room4", cMonth);
	GetData("room5", cMonth);
	GetData("room6", cMonth);
	GetData("room7", cMonth);
	GetData("room8", cMonth);
	GetData("room9", cMonth);

	const handleClick = (day: string, room: string, status: any) => {
		setSelectedInfo({ date: day, room, status: checkStatus(status) });
		setIsOpen(true);
	};

	return (
		<div>
			{isClient && (
				<>
					<SpringModal
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						reservationInfo={selectedInfo}
					/>

					<Table className="">
						<TableCaption>Резервационен лист</TableCaption>

						<TableHeader className="bg-white bg-opacity-100 w-full flex justify-center fixed">
							<TableHead className=" w-[10%] flex items-center justify-center">
								Ден
							</TableHead>
							<TableRow className="w-full flex justify-center text-[10px] sm:text-sm text-left items-center lg:gap-[85px] gap-3 md:gap-[69px]">
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 3
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 4
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 5
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 6
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 7
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 8
								</TableHead>
								<TableHead className="w-1/7 hover:bg-blue-500 text-black ">
									Стая 9
								</TableHead>
							</TableRow>
						</TableHeader>
						<div className="bg-black h-10"></div>
						<TableBody className="">
							{!change && (
								<>
									{globalReservations.map((invoice) => (
										<TableRow key={invoice.day}>
											<TableCell className="font-medium flex gap-12 items-center ">
												{invoice.day}
											</TableCell>

											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room3",
														invoice.room3Status,
													)
												}
											>
												{checkStatus(invoice.room3Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room4",
														invoice.room4Status,
													)
												}
											>
												{checkStatus(invoice.room4Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room5",
														invoice.room5Status,
													)
												}
											>
												{checkStatus(invoice.room5Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room6",
														invoice.room6Status,
													)
												}
											>
												{checkStatus(invoice.room6Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room7",
														invoice.room7Status,
													)
												}
											>
												{checkStatus(invoice.room7Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room8",
														invoice.room8Status,
													)
												}
											>
												{checkStatus(invoice.room8Status)}
											</TableCell>
											<TableCell
												onClick={() =>
													handleClick(
														`${invoice.day}/${month}/2024/14:00`,
														"room9",
														invoice.room9Status,
													)
												}
											>
												{checkStatus(invoice.room9Status)}
											</TableCell>
										</TableRow>
									))}
								</>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={7}>
									<Select
										value={cMonth.toString()}
										onValueChange={(value) => {
											setCMonth(parseInt(value, 10));
											setChange(true);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Избери" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Месец</SelectLabel>
												{[...Array(12)].map((_, index) => (
													<SelectItem key={index} value={index.toString()}>
														{monthNames[index]}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell className="text-right"></TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</>
			)}
		</div>
	);
};
export default CalRes;
