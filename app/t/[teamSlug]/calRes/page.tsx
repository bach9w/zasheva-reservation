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
import { getReservationInfo } from "../hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiBook } from "react-icons/fi";

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
	if (status === "X") {
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
				changeRoomStatus(formattedDate, room, "X");

				// Преминаваме към следващия ден
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});
	}
}

type ReservationInfo = {
	status: string;
	room: string;
	date: string;
};

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

							<div>
								<p className="text-center mb-6">
									Състояние - {reservationInfo.status}
								</p>
								<p className="text-center mb-6">
									Стая - {reservationInfo.room}
								</p>
								<p className="text-center mb-6">Име на гост - {guestName}</p>

								<p className="text-center mb-6">
									Дата на напускане - {departureDates}
								</p>
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
	const [isOpen, setIsOpen] = useState(false);
	const [selectedInfo, setSelectedInfo] = useState({
		date: "",
		room: "",
		status: "" as any,
	});

	GetData("room3");
	GetData("room4");
	GetData("room5");
	GetData("room6");
	GetData("room7");
	GetData("room8");
	GetData("room9");

	const handleClick = (day: string, room: string, status: any) => {
		setSelectedInfo({ date: day, room, status: checkStatus(status) });
		setIsOpen(true);
	};

	return (
		<div>
			<SpringModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				reservationInfo={selectedInfo}
			/>
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

							<TableCell
								onClick={() =>
									handleClick(
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
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
										`${invoice.day}/02/2024`,
										"room9",
										invoice.room9Status,
									)
								}
							>
								{checkStatus(invoice.room9Status)}
							</TableCell>
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
