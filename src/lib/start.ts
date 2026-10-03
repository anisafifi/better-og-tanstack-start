import type { ImageResponseOptions } from "@takumi-rs/image-response";
import type { ReactNode } from "react";
import type {
	CreateOgRouteHandlerOptions,
	Font,
	FontSource,
	LayoutStrategy,
	OgComponentFactory,
	ResolveOgRequestOptions,
	RouteParams,
} from "./core";
import {
	createCachedModuleLoader,
	createOgRouteHandler as createCoreOgRouteHandler,
	resolveLocaleFromParams,
} from "./core";

type TanStackStartImageResponseOptions = Omit<
	ImageResponseOptions,
	"fonts" | "format" | "height" | "renderer" | "width"
>;
type SharedTextResolver = CreateOgRouteHandlerOptions<
	ReactNode,
	TanStackStartRouteHandlerContext,
	TanStackStartImageResponseOptions
>["textFromComponent"];

interface TanStackImageResponseModule {
	ImageResponse: new (
		element: ReactNode,
		options?: ImageResponseOptions,
	) => Response;
}

export interface TanStackStartRouteHandlerContext {
	params?: Promise<RouteParams> | RouteParams;
	request: Request;
}

export interface TanStackStartOgHandlerOptions
	extends TanStackStartImageResponseOptions {
	aspectRatio?: string;
	baseFonts?: Font[];
	component: ReactNode | OgComponentFactory<ReactNode>;
	fallbackLocales?: string[];
	format?: "png" | "webp";
	layout?: LayoutStrategy;
	localeFromRequest?: (request: Request) => string | undefined;
	platform?: string;
	resolveRequestOptions?: ResolveOgRequestOptions;
	sources?: FontSource[];
	text?: string;
	textFromComponent?: SharedTextResolver;
}

const getImageResponseModule = createCachedModuleLoader(
	() =>
		import("@takumi-rs/image-response") as Promise<TanStackImageResponseModule>,
);

export const createOgRouteHandler = (
	options: TanStackStartOgHandlerOptions,
) => {
	const {
		aspectRatio: _aspectRatio,
		component,
		fallbackLocales: _fallbackLocales,
		format,
		layout: _layout,
		localeFromRequest,
		platform: _platform,
		resolveRequestOptions,
		sources: _sources,
		text,
		textFromComponent,
		...imageResponseOptions
	} = options;

	return createCoreOgRouteHandler<
		ReactNode,
		TanStackStartRouteHandlerContext,
		TanStackStartImageResponseOptions
	>({
		baseFonts: options.baseFonts,
		component,
		fallbackLocales: options.fallbackLocales,
		localeFromContext: async (context: TanStackStartRouteHandlerContext) =>
			resolveLocaleFromParams(
				context.params ? await context.params : undefined,
			),
		localeFromRequest,
		renderOptions: imageResponseOptions,
		renderer: async ({
			component: renderComponent,
			fonts,
			options: renderOptions,
			resolvedRequest,
		}) => {
			const { ImageResponse } = await getImageResponseModule();
			const baseOptions = {
				...renderOptions,
				fonts,
				height: resolvedRequest.height,
				width: resolvedRequest.width,
			};

			return new ImageResponse(
				renderComponent,
				(format ?? resolvedRequest.capabilities.preferredFormat) === "webp"
					? { ...baseOptions, format: "webp" }
					: { ...baseOptions, format: "png" },
			);
		},
		resolveRequestOptions: {
			...resolveRequestOptions,
			...(options.aspectRatio ? { aspectRatio: options.aspectRatio } : {}),
			...(options.layout ? { layout: options.layout } : {}),
			...(options.platform ? { platform: options.platform } : {}),
		},
		sources: options.sources,
		text,
		textFromComponent,
	});
};
