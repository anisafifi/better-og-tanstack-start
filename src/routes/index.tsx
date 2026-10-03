import { createFileRoute } from "@tanstack/react-router";
import { loadGoogleFonts, resolveFontSetup } from "#/lib/core";
import { createOgHandler } from "#/lib/worker";
import { resolveOgTheme, resolveTemplate } from "#/template";

const FONT_WEIGHTS = [400, 700];
const FONT_STACK = 'Inter, "Noto Serif Bengali"';

export const Route = createFileRoute("/")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const [latinFonts, bengaliFonts] = await Promise.all([
					loadGoogleFonts({ family: "Inter", weights: FONT_WEIGHTS }),
					loadGoogleFonts({
						family: "Noto Serif Bengali",
						weights: FONT_WEIGHTS,
					}),
				]);
				const fontSetup = await resolveFontSetup({
					baseFonts: [...latinFonts, ...bengaliFonts],
				});
				const url = new URL(request.url);
				const template = resolveTemplate(url.searchParams.get("template"));
				const theme = resolveOgTheme(
					url.searchParams.get("theme"),
					request.headers.get("sec-ch-prefers-color-scheme"),
				);
				const title = url.searchParams.get("title") ?? "OG Image Generator";
				const description = url.searchParams.get("description") ?? "";

				const handler = createOgHandler({
					baseFonts: fontSetup.fonts,
					component: (og) =>
						template({
							description,
							fontFamily: FONT_STACK,
							og,
							theme,
							title,
						}),
				});

				const response = await handler(request);
				response.headers.set("Vary", "Sec-CH-Prefers-Color-Scheme");

				return response;
			},
		},
	},
});
