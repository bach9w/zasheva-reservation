import { entsTableFactory, scheduledDeleteFactory } from "convex-ents";
import {
	customCtx,
	customMutation,
	customQuery,
} from "convex-helpers/server/customFunctions";

import {
	MutationCtx as BaseMutationCtx,
	QueryCtx as BaseQueryCtx,
	internalMutation as baseInternalMutation,
	internalQuery as baseInternalQuery,
	mutation as baseMutation,
	query as baseQuery,
} from "./_generated/server";
import { entDefinitions } from "./schema";
import { v } from "convex/values";

export const myNewQuery = baseQuery({
	args: {
		room: v.string(),
	},
	handler: async (ctx, args) => {
		const reservations = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("roomNumber"), args.room))
			.collect();

		return reservations;
	},
});

export const myDayResQuery = baseQuery({
	args: {
		day: v.string(),
	},
	handler: async (ctx, args) => {
		const dayRes = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("arivalDate"), args.day))
			.collect();

		return dayRes;
	},
});
export const depResQuery = baseQuery({
	args: {
		day: v.string(),
	},
	handler: async (ctx, args) => {
		const dayRes = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("departureDate"), args.day))
			.collect();

		return dayRes;
	},
});

function dateLessThan(date1: string, date2: string): boolean {
	// Разделяне на входните низове на компоненти
	const parts1 = date1.split("/");
	const parts2 = date2.split("/");

	// Извличане на месеците и преобразуване към числа
	const month1 = parseInt(parts1[1], 10);
	const month2 = parseInt(parts2[1], 10);

	// Сравняване на месеците първо
	if (month1 !== month2) {
		return month1 < month2;
	}

	// Ако месеците са еднакви, продължаваме със сравнението на дните
	const day1 = parseInt(parts1[0], 10);
	const day2 = parseInt(parts2[0], 10);
	if (day1 !== day2) {
		return day1 < day2;
	} else if (day1 === day2) {
		return true;
	}

	// Ако и дните са еднакви, сравняваме годините
	const year1 = parseInt(parts1[2], 10);
	const year2 = parseInt(parts2[2], 10);
	if (year1 !== year2) {
		return year1 < year2;
	}

	// Накрая, ако и годините са еднакви, сравняваме времето
	const time1 = parts1[3].split(":").map(Number);
	const time2 = parts2[3].split(":").map(Number);
	const hours1 = time1[0];
	const minutes1 = time1[1];
	const hours2 = time2[0];
	const minutes2 = time2[1];

	if (hours1 !== hours2) {
		return hours1 < hours2;
	}

	return minutes1 < minutes2;
}

export const roomReservationInfo = baseQuery({
	args: {
		room: v.string(),
		day: v.string(),
	},
	handler: async (ctx, args) => {
		for await (const reservation of ctx.db.query("messages")) {
			if (
				dateLessThan(reservation.arivalDate, args.day) &&
				dateLessThan(args.day, reservation.departureDate) &&
				reservation.roomNumber === args.room
			) {
				return reservation;
			}
		}
	},
});

export const query = customQuery(
	baseQuery,
	customCtx(async (baseCtx) => {
		return await queryCtx(baseCtx);
	}),
);

export const internalQuery = customQuery(
	baseInternalQuery,
	customCtx(async (baseCtx) => {
		return await queryCtx(baseCtx);
	}),
);

export const mutation = customMutation(
	baseMutation,
	customCtx(async (baseCtx) => {
		return await mutationCtx(baseCtx);
	}),
);

export const internalMutation = customMutation(
	baseInternalMutation,
	customCtx(async (baseCtx) => {
		return await mutationCtx(baseCtx);
	}),
);

async function queryCtx(baseCtx: BaseQueryCtx) {
	const ctx = {
		...baseCtx,
		db: undefined,
		table: entsTableFactory(baseCtx, entDefinitions),
	};
	const identity = await ctx.auth.getUserIdentity();
	const viewer =
		identity === null
			? null
			: await ctx
					.table("users")
					.get("tokenIdentifier", identity.tokenIdentifier);
	const viewerX = () => {
		if (viewer === null) {
			throw new Error("Expected authenticated viewer");
		}
		return viewer;
	};
	return { ...ctx, viewer, viewerX };
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
	const ctx = {
		...baseCtx,
		db: undefined,
		table: entsTableFactory(baseCtx, entDefinitions),
	};
	const identity = await ctx.auth.getUserIdentity();
	const viewer =
		identity === null
			? null
			: await ctx
					.table("users")
					.get("tokenIdentifier", identity.tokenIdentifier);
	const viewerX = () => {
		if (viewer === null) {
			throw new Error("Expected authenticated viewer");
		}
		return viewer;
	};
	return { ...ctx, viewer, viewerX };
}

export const scheduledDelete = scheduledDeleteFactory(entDefinitions);
