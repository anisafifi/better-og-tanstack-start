import type { ReactNode } from "react";
import type { ResolvedOgRequest } from "#/lib/core";

export interface OgTemplateProps {
	description: string;
	fontFamily: string;
	og: ResolvedOgRequest;
	title: string;
}

export type OgTemplate = (props: OgTemplateProps) => ReactNode;
