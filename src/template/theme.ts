export type OgTheme = "light" | "dark";

export interface OgThemePalette {
	accent: string;
	background: string;
	description: string;
	muted: string;
	text: string;
}

export const ogPalettes: Record<OgTheme, OgThemePalette> = {
	dark: {
		accent: "linear-gradient(90deg, #818cf8 0%, #f472b6 100%)",
		background: "#0b0b12",
		description: "#d4d4d8",
		muted: "#a1a1aa",
		text: "#fafafa",
	},
	light: {
		accent: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
		background: "#fafafa",
		description: "#52525b",
		muted: "#a1a1aa",
		text: "#111111",
	},
};

export const resolveOgTheme = (
	param: string | null | undefined,
	header: string | null | undefined,
): OgTheme | undefined => {
	const candidate = param ?? header;

	return candidate === "dark" || candidate === "light" ? candidate : undefined;
};
