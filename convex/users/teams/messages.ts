import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "../../functions";
import { viewerHasPermission, viewerWithPermissionX } from "../../permissions";

export const list = query({
	args: {
		teamId: v.id("teams"),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, { teamId, paginationOpts }) => {
		if (
			ctx.viewer === null ||
			!(await viewerHasPermission(ctx, teamId, "Contribute"))
		) {
			return {
				page: [],
				isDone: true,
				continueCursor: "",
			};
		}
		return await ctx
			.table("teams")
			.getX(teamId)
			.edge("messages")
			.order("desc")
			.paginate(paginationOpts)
			.map(async (message) => {
				const member = await message.edge("member");
				const user = await member.edge("user");
				return {
					_id: message._id,
					_creationTime: message._creationTime,
					text: message.text,
					isBooking: message.isBooking,
					isPaid: message.isPaid,
					roomNumber: message.roomNumber,
					priceToCollect: message.priceToCollect,
					numberOfGuests: message.numberOfGuests,
					arivalDate: message.arivalDate,
					departureDate: message.departureDate,
					author: user.firstName ?? user.fullName,
					authorPictureUrl: user.pictureUrl,
					isAuthorDeleted: member.deletionTime !== undefined,
				};
			});
	},
});

export const create = mutation({
	args: {
		teamId: v.id("teams"),
		text: v.string(),
		isBooking: v.optional(v.boolean()),
		isPaid: v.optional(v.boolean()),
		roomNumber: v.optional(v.string()),
		priceToCollect: v.optional(v.string()),
		numberOfGuests: v.optional(v.string()),
		arivalDate: v.optional(v.any()),
		departureDate: v.optional(v.any()),
	},
	handler: async (ctx, { teamId, text }) => {
		const member = await viewerWithPermissionX(ctx, teamId, "Contribute");
		if (text.trim().length === 0) {
			throw new Error("Reservation must not be empty");
		}
		await ctx.table("messages").insert({
			text,
			isBooking: false,
			isPaid: false,
			roomNumber: "one",
			priceToCollect: "100",
			numberOfGuests: "2",
			arivalDate: "2022-01-01",
			departureDate: "2022-01-02",
			teamId: teamId,
			memberId: member._id,
		});
	},
});

export const createBooking = mutation({
	args: {
		teamId: v.id("teams"),
		text: v.string(),
		isBooking: v.boolean(),
		isPaid: v.boolean(),
		roomNumber: v.string(),
		priceToCollect: v.string(),
		numberOfGuests: v.string(),
		arivalDate: v.optional(v.any()),
		departureDate: v.optional(v.any()),
	},
	handler: async (
		ctx,
		{
			teamId,
			text,
			isBooking,
			isPaid,
			roomNumber,
			priceToCollect,
			numberOfGuests,
			arivalDate,
			departureDate,
		},
	) => {
		const member = await viewerWithPermissionX(ctx, teamId, "Contribute");
		if (text.trim().length === 0) {
			throw new Error("Reservation must not be empty");
		}
		await ctx.table("messages").insert({
			text,
			isBooking: isBooking,
			isPaid,
			roomNumber,
			priceToCollect,
			numberOfGuests,
			arivalDate,
			departureDate,
			teamId: teamId,
			memberId: member._id,
		});
	},
});
