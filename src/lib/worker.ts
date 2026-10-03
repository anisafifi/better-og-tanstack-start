import type { ImageResponseOptions } from "@takumi-rs/image-response";
import { ImageResponse } from "@takumi-rs/image-response";
import { initSync, Renderer } from "@takumi-rs/wasm";
import workersWasmModule from "@takumi-rs/wasm/auto";
import type { ReactNode } from "react";
import type {
	CreateOgRouteHandlerOptions,
	Font,
	FontSource,
	LayoutStrategy,
	OgComponentFactory,
	ResolveOgRequestOptions,
} from "./core";
import { createOgRouteHandler as createCoreOgRouteHandler } from "./core";

type WorkersRenderer = Renderer;
type WorkersFontInput = Parameters<WorkersRenderer["registerFont"]>[0];
type WorkersRendererOptions = Extract<
	ImageResponseOptions,
	{ renderer: unknown }
>;
type WorkersImageResponseOptions = Omit<
	WorkersRendererOptions,
	"format" | "height" | "renderer" | "width"
>;
type SharedTextResolver = CreateOgRouteHandlerOptions<
	ReactNode,
	undefined,
	WorkersImageResponseOptions
>["textFromComponent"];

export interface WorkersOgHandlerOptions extends WorkersImageResponseOptions {
	aspectRatio?: string;
	baseFonts?: Font[];
	component: ReactNode | OgComponentFactory<ReactNode>;
	fallbackLocales?: string[];
	format?: "png" | "webp";
	layout?: LayoutStrategy;
	localeFromRequest?: (request: Request) => string | undefined;
	platform?: string;
	renderer?: WorkersRenderer;
	resolveRequestOptions?: ResolveOgRequestOptions;
	sources?: FontSource[];
	takumiRenderer?: WorkersRenderer;
	text?: string;
	textFromComponent?: SharedTextResolver;
}

let isWorkersWasmInitialized = false;

const ensureWorkersWasmRuntime = () => {
	if (!isWorkersWasmInitialized) {
		initSync({ module: workersWasmModule });
		isWorkersWasmInitialized = true;
	}
};

const toWorkersFontInput = (font: Font): WorkersFontInput => {
	const data =
		font.data instanceof Uint8Array ? font.data : new Uint8Array(font.data);
	const style =
		font.style === "italic" ||
		font.style === "normal" ||
		font.style === "oblique"
			? font.style
			: undefined;

	if (!font.name && !font.weight && !style) {
		return data;
	}

	return {
		...(font.name ? { name: font.name } : {}),
		...(typeof font.weight === "number" ? { weight: font.weight } : {}),
		...(style ? { style } : {}),
		data,
	};
};

const loadFontsIntoRenderer = async (
	renderer: WorkersRenderer,
	fonts: Font[],
): Promise<void> => {
	await Promise.all(
		fonts.map(
			async (font) => await renderer.registerFont(toWorkersFontInput(font)),
		),
	);
};

const resolveWorkersRenderer = async (
	configuredRenderer: WorkersRenderer | undefined,
	fonts: Font[],
): Promise<WorkersRenderer> => {
	ensureWorkersWasmRuntime();

	if (!configuredRenderer) {
		const renderer = new Renderer();

		await loadFontsIntoRenderer(renderer, fonts);

		return renderer;
	}

	await loadFontsIntoRenderer(configuredRenderer, fonts);

	return configuredRenderer;
};

export const createOgHandler = (options: WorkersOgHandlerOptions) => {
	const {
		aspectRatio: _aspectRatio,
		component,
		fallbackLocales: _fallbackLocales,
		format,
		layout: _layout,
		localeFromRequest,
		platform: _platform,
		renderer,
		resolveRequestOptions,
		sources: _sources,
		takumiRenderer,
		text,
		textFromComponent,
		...imageResponseOptions
	} = options;

	return createCoreOgRouteHandler<
		ReactNode,
		undefined,
		WorkersImageResponseOptions
	>({
		baseFonts: options.baseFonts,
		component,
		fallbackLocales: options.fallbackLocales,
		localeFromRequest,
		renderOptions: imageResponseOptions,
		renderer: async ({
			component: renderComponent,
			fonts,
			options: renderOptions,
			resolvedRequest,
		}) => {
			const resolvedRenderer = await resolveWorkersRenderer(
				takumiRenderer ?? renderer,
				fonts,
			);

			return new ImageResponse(renderComponent, {
				...renderOptions,
				format: format ?? resolvedRequest.capabilities.preferredFormat,
				height: resolvedRequest.height,
				renderer: resolvedRenderer,
				width: resolvedRequest.width,
			});
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
