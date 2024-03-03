"use client";

import { Calendar } from "@/components/ui/calendar";

import { useEffect, useState } from "react";

export default function PlannerRes() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) return null;

	return (
		<>
			<div className="flex justify-center h-full mt-4 w-full">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-md border h-full w-full"
				/>
			</div>
			<div className="w-full flex justify-center">
				<div className="w-full justify-center items-center object-center text-center">
					{date?.toLocaleDateString()}
					<br />
					<div className="bg-white uppercase text-black">резервации</div>

					{date?.toLocaleDateString() === "04/03/2024" ? (
						<>
							<div className="">Стая 3 - Иван</div>
							<div className="">Стая 4 - Петър</div>
							<div className="">Стая 5 - Георги</div>
							<div className="">Стая 6 - Мария</div>
						</>
					) : (
						<div className="">Стая 6 - Свободна</div>
					)}
				</div>
			</div>
		</>
	);
}
