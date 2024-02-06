"use client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function CalendarZone() {
	const [date, setDate] = useState<Date | undefined>(new Date());

	return (
		<div className="max-w-xl justify-center flex gap-2 mt-8">
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-md border shadow"
			/>
		</div>
	);
}
