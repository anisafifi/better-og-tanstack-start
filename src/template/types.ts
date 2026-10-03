import type { ReactNode } from "react";
import type { ResolvedOgRequest } from "#/lib/core";
import type { OgTheme } from "./theme";

export interface OgTemplateProps {
	description: string;
	fontFamily: string;
	og: ResolvedOgRequest;
	theme?: OgTheme;
	title: string;
}

export type OgTemplate = (props: OgTemplateProps) => ReactNode;
