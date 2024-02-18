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
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useCurrentTeam } from "../hooks";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useToast } from "@/components/ui/use-toast";

export function AlertDialogCleaned({ id }: { id: any }) {
	const team = useCurrentTeam();

	const isArrived = useMutation(api.users.teams.messages.updateIsCleaned);
	const { toast } = useToast();

	function handleArrived(id: any) {
		console.log(id);
		void isArrived({ id: id }).then(() => {
			toast({
				title: "Успешно",
				description: "Резервацията беше отбелязана като почистена",
				variant: "destructive",
			});
		});
	}
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Почистена</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Сигурен ли си?</AlertDialogTitle>
					<AlertDialogDescription>
						Това действие не може да бъде отменено.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Откажи</AlertDialogCancel>
					<AlertDialogAction onClick={() => handleArrived(id)}>
						Промени
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
