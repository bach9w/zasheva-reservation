"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format, parse, setHours, setMinutes } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from "@/components/ui/select";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	note: z.string().max(100),
	room: z.string().min(1).max(10),
	isBooking: z.boolean(),
	isPaid: z.boolean(),
	guests: z.string().max(10),
	priceToCollect: z.string().max(10),
	arivalDate: z.string(),
	departureDate: z.string(),
	isArrived: z.boolean(),
	isDeparted: z.boolean(),
	isCleaned: z.boolean(),
});

export function Booking() {
	const [isRoomFree, setIsRoomFree] = useState(false);
	const sendMessage = useMutation(api.users.teams.messages.createBooking);

	const team = useCurrentTeam();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			note: "",
			isBooking: false,
			isPaid: false,
			room: "",
			priceToCollect: "",
			guests: "",
			arivalDate: "",
			departureDate: "",
			isArrived: false,
			isDeparted: false,
			isCleaned: false,
		},
	});

	const { toast } = useToast();
	const { reset } = form;

	const isFree = useQuery(api.functions.roomReservationInfo, {
		room: form.watch("room"),
		day: form.watch("arivalDate"),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (!isFree) {
			void sendMessage({
				text: values.name,
				note: values.note,
				isBooking: values.isBooking,
				isPaid: values.isPaid,
				roomNumber: values.room,
				priceToCollect: values.priceToCollect,
				numberOfGuests: values.guests,
				arivalDate: values.arivalDate,
				departureDate: values.departureDate,
				teamId: team!._id,
			}).then(() => {
				console.log(values);
				reset({
					name: "",
					note: "",
					isBooking: false,
					isPaid: false,
					room: "",
					priceToCollect: "",
					guests: "",
					arivalDate: "",
					departureDate: "",
				});
				toast({
					title: "Резервацията е обработена успешно",
					description: "Продължи напред",
					variant: "success",
				});
			});
		} else {
			toast({
				title: "Стаята не е свободна",
				description: "Избери друга стая",
				variant: "destructive",
			});
			return;
		}
	}

	return (
		<Card>
			<CardHeader></CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col  gap-6 w-full justify-center hide-lastpass-icon"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Име</FormLabel>
									<FormControl>
										<Textarea placeholder="Име на гост" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Забележка</FormLabel>
									<FormControl>
										<Textarea placeholder="Забележка" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isBooking"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="flex gap-x-1 border-4 hover:border-white rounded-lg p-2  justify-center">
											<Checkbox
												onCheckedChange={field.onChange as () => void}
											/>
											<label
												htmlFor="isBooking"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Booking
											</label>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isPaid"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="flex gap-x-1 border-4 hover:border-white rounded-lg p-2 justify-center">
											<Checkbox
												onCheckedChange={field.onChange as () => void}
											/>
											<label
												htmlFor="isPaid"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Платено
											</label>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="room"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="flex gap-x-1 border-2 hover:border-white rounded-lg p-2 justify-center">
											<Select onValueChange={field.onChange}>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Номер на стая" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Стаи</SelectLabel>
														<SelectItem value="room3">3</SelectItem>
														<SelectItem value="room4">4</SelectItem>
														<SelectItem value="room5">5</SelectItem>
														<SelectItem value="room6">6</SelectItem>
														<SelectItem value="room7">7</SelectItem>
														<SelectItem value="room8">8</SelectItem>
														<SelectItem value="room9">9</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="guests"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-x-1 border-2 hover:border-white rounded-lg p-2 justify-evenly items-center">
										<FormControl>
											<Select onValueChange={field.onChange}>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Брой гости" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Гости</SelectLabel>
														<SelectItem value="two">2</SelectItem>
														<SelectItem value="three">3</SelectItem>
														<SelectItem value="four">4</SelectItem>
														<SelectItem value="five">5</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="priceToCollect"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Сума за плащане</FormLabel>
									<FormControl>
										<Input placeholder="Сума за плащане" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="arivalDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Дата на настаняване</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														" pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														field.value // Тук вече използваме стойността директно като string
													) : (
														<span>Избери дата</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value
														? parse(field.value, "dd/MM/yyyy/HH:mm", new Date())
														: undefined
												}
												onSelect={(date: any) => {
													let dateWithTime = setHours(setMinutes(date, 0), 14);
													field.onChange(
														format(dateWithTime, "dd/MM/yyyy/HH:mm"),
													);
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>Дата на настаняване</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="departureDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Дата на напускане</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														field.value // Тук вече използваме стойността директно като string
													) : (
														<span>Избери дата</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value
														? parse(field.value, "dd/MM/yyyy/HH:mm", new Date())
														: undefined
												} // Преобразуване на string в Date за календара
												onSelect={(date: any) => {
													let dateWithTime = setHours(setMinutes(date, 0), 12);
													field.onChange(
														format(dateWithTime, "dd/MM/yyyy/HH:mm"),
													);
												}} // Записване на избраната дата като string
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>Дата на напускане</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="w-full" type="submit">
							<PlusIcon className="mr-2 h-4 w-4" /> Обработи резервацията
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

const FULL_DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
	timeStyle: "short",
	dateStyle: "short",
});

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
	timeStyle: "short",
});

function formatDateTime(timestamp: number) {
	const isToday =
		new Date(timestamp).setHours(0, 0, 0, 0) ===
		new Date().setHours(0, 0, 0, 0);
	if (isToday) {
		return TIME_FORMAT.format(timestamp);
	}
	return FULL_DATE_TIME_FORMAT.format(timestamp);
}
