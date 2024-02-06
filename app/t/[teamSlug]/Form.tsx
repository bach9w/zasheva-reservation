"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	room: z.string().min(1).max(10),
	isBooking: z.boolean(),
	isPaid: z.boolean(),
	guests: z.string().max(10),
	priceToCollect: z.string().max(10),
	arivalDate: z.string(),
	departureDate: z.string(),
});

export function Booking() {
	const sendMessage = useMutation(api.users.teams.messages.createBooking);
	const team = useCurrentTeam();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			isBooking: false,
			isPaid: false,
			room: "",
			priceToCollect: "",
			guests: "",
			arivalDate: "",
			departureDate: "",
		},
	});

	const { toast } = useToast();
	const { reset } = form;

	function onSubmit(values: z.infer<typeof formSchema>) {
		void sendMessage({
			text: values.name,
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
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Име</FormLabel>
							<FormControl>
								<Textarea placeholder="Име на гост" {...field} />
							</FormControl>
							<FormDescription>Име на госта</FormDescription>
						</FormItem>
					)}
				/>
				<div className="flex justify-evenly">
					<FormField
						control={form.control}
						name="isBooking"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex gap-x-1 border-4 hover:border-white rounded-lg p-2  justify-center">
										<Checkbox onCheckedChange={field.onChange as () => void} />
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
										<Checkbox onCheckedChange={field.onChange as () => void} />
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
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-around">
					<FormField
						control={form.control}
						name="guests"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Брой гости</FormLabel>
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
				</div>
				<div className="flex justify-evenly">
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
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													field.value // Тук вече използваме стойността директно като string
												) : (
													<span>Избери дате</span>
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
													? parse(field.value, "dd/MM/yyyy", new Date())
													: undefined
											}
											onSelect={(
												date: any, // Explicitly type the 'date' parameter as a Date object
											) => field.onChange(format(date, "dd/MM/yyyy"))}
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
						render={({ field }: { field: any }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Дата на напускане</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													field.value // Тук вече използваме стойността директно като string
												) : (
													<span>Избери дате</span>
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
													? parse(field.value, "dd/MM/yyyy", new Date())
													: undefined
											} // Преобразуване на string в Date за календара
											onSelect={(date: any) =>
												field.onChange(format(date, "dd/MM/yyyy"))
											} // Записване на избраната дата като string
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>Дата на напускане</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button className="w-full" type="submit">
					Обработи резервацията
				</Button>
			</form>
		</Form>
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
