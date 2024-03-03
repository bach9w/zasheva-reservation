import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx } = defineConfig({
	hooks: {
		"cx:done": (className) => twMerge(className),
	},
});

export type { VariantProps } from "cva";

export const tw = String.raw;
