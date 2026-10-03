import { readFileSync } from "node:fs";
import { Renderer, initSync } from "@takumi-rs/wasm";

const UA =
	"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const wasmBytes = readFileSync(
	new URL(
		"./node_modules/@takumi-rs/wasm/pkg/takumi_wasm_bg.wasm",
		import.meta.url
	)
);
initSync({ module: wasmBytes });

async function loadFont(family: string, weight: number) {
	const url = `https://fonts.googleapis.com/css2?family=${family.split(" ").join("+")}:wght@${weight}&display=swap`;
	const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
	const fontUrl = css.match(/url\(([^)]+)\)/)?.[1];
	if (!fontUrl) throw new Error(`no font url for ${family}`);
	return new Uint8Array(await (await fetch(fontUrl)).arrayBuffer());
}

const inter = [
	await loadFont("Inter", 400),
	await loadFont("Inter", 700),
];
const bengali = [
	await loadFont("Noto Serif Bengali", 400),
	await loadFont("Noto Serif Bengali", 700),
];

const makeNode = (text: string, family: string) => ({
	type: "container" as const,
	style: { backgroundColor: "#fff", display: "flex", fontFamily: family, fontSize: 80, padding: 20 },
	children: [{ type: "text" as const, text }],
});

const count = (svg: string) => (svg.match(/<path/g) ?? []).length;

for (const withBengali of [false, true]) {
	const renderer = new Renderer();
	await renderer.registerFont({ data: inter[0], name: "Inter", style: "normal", weight: 400 });
	await renderer.registerFont({ data: inter[1], name: "Inter", style: "normal", weight: 700 });
	if (withBengali) {
		await renderer.registerFont({ data: bengali[0], name: "Noto Serif Bengali", style: "normal", weight: 400 });
		await renderer.registerFont({ data: bengali[1], name: "Noto Serif Bengali", style: "normal", weight: 700 });
	}
	console.log(`\nregistered bengali: ${withBengali}`);
	for (const family of [
		'Inter, "Noto Serif Bengali"',
		"Inter, Noto Serif Bengali",
		"Inter",
		"Noto Serif Bengali",
	]) {
		for (const text of ["Hello", "বাংলা", "ঈশ্বরগঞ্জ"]) {
			try {
				const svg = await renderer.renderSvg(makeNode(text, family) as never, {
					height: 160,
					width: 1200,
				} as never);
				console.log(`  ${family.padEnd(30)} ${text.padEnd(10)} paths=${count(svg)}`);
			} catch (error) {
				console.log(`  ${family.padEnd(30)} ${text.padEnd(10)} ERROR ${(error as Error).message.slice(0, 60)}`);
			}
		}
	}
}
