import { defaultTemplate } from "./default";
import { minimalTemplate } from "./minimal";
import type { OgTemplate } from "./types";

export const DEFAULT_TEMPLATE = "default";

export const templates: Record<string, OgTemplate> = {
	[DEFAULT_TEMPLATE]: defaultTemplate,
	minimal: minimalTemplate,
};

export const templateNames = Object.keys(templates);

export const resolveTemplate = (name: string | null | undefined): OgTemplate =>
	(name ? templates[name] : undefined) ?? templates[DEFAULT_TEMPLATE];

export type { OgTheme, OgThemePalette } from "./theme";
export { ogPalettes, resolveOgTheme } from "./theme";
export type { OgTemplate, OgTemplateProps } from "./types";
