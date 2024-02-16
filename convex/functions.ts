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

export const roomReservationInfo = baseQuery({
	args: {
		room: v.string(),
		day: v.string(),
	},
	handler: async (ctx, args) => {
		const reservation = await ctx.db
			.query("messages")
			.filter((q) =>
				q.and(
					q.lte(q.field("arivalDate"), args.day),

					q.gte(q.field("departureDate"), args.day),
					q.eq(q.field("roomNumber"), args.room),
				),
			)
			.unique();
		return reservation;
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
