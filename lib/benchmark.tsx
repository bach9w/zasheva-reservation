/* eslint-disable tailwindcss/enforces-shorthand -- benchmarking purposes */
import { cva } from "@/app/utils/classnames";

const smallComponent = cva({
	base: "h-full w-full border bg-black/5 px-2 py-4 text-white/5 xs:px-4 xs:py-6",
	variants: {
		color: {
			black: "border-black/10",
			white: "border-white/10",
		},
		size: {
			big: "min-h-32 min-w-32",
			small: "min-h-16 min-w-16",
		},
	},
});

const timeBeforeSmallComponent = performance.now();

smallComponent({
	className: ["px-2 py-2", "bg-red-11"],
	color: "black",
	size: "big",
});
smallComponent({
	className: ["px-2 py-2", "bg-red-11"],
	color: "black",
	size: "small",
});
smallComponent({
	className: ["px-2 py-2", "bg-red-11"],
	color: "white",
	size: "big",
});
smallComponent({
	className: ["px-2 py-2", "bg-red-11"],
	color: "white",
	size: "small",
});

const timeAfterSmallComponent = performance.now();

console.log(
	"Small component all variants with overrides",
	timeAfterSmallComponent - timeBeforeSmallComponent,
);

const bigComponent = cva({
	base: "absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-full border-2 border-red-8 bg-blue-10 text-red-8 hover:border-red-2 xs:bottom-2 xs:left-2 xs:right-2 xs:top-2",
	variants: {
		color: {
			black: "leading-8 text-black",
			blue: "leading-9 text-red-8",
			red: "leading-4 text-red-2",
			white: "leading-6 text-white",
		},
		intent: {
			primary: "border-red-3 bg-blue-2",
			secondary: "border-red-2 bg-blue-4",
			tertiary: "border-red-1 bg-blue-8",
		},
		size: {
			big: "inset-8 min-h-32 min-w-32 xs:inset-4 xs:min-h-48 xs:min-w-48",
			medium: "inset-4 min-h-24 min-w-24 xs:inset-2 xs:min-h-32 xs:min-w-32",
			small: "inset-2 min-h-16 min-w-16 xs:inset-2 xs:min-h-24 xs:min-w-24",
		},
	},
});

const timeBeforeBigComponent = performance.now();

bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "primary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "primary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "primary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "secondary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "secondary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "secondary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "tertiary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "tertiary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "black",
	intent: "tertiary",
	size: "small",
});

bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "primary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "primary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "primary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "secondary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "secondary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "secondary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "tertiary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "tertiary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "blue",
	intent: "tertiary",
	size: "small",
});

bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "primary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "primary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "primary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "secondary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "secondary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "secondary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "tertiary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "tertiary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "red",
	intent: "tertiary",
	size: "small",
});

bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "primary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "primary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "primary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "secondary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "secondary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "secondary",
	size: "small",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "tertiary",
	size: "big",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "tertiary",
	size: "medium",
});
bigComponent({
	className: [
		"inset-4 left-2 xs:left-4 hover:border-blue-2",
		"min-h-16",
		"min-w-24",
		"leading-2",
		"leading-8",
		"rounded",
	],
	color: "white",
	intent: "tertiary",
	size: "small",
});

const timeAfterBigComponent = performance.now();

console.log(
	"Medium component all variants with overrides",
	timeAfterBigComponent - timeBeforeBigComponent,
);
