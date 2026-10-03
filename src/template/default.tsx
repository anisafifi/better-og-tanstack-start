import type { OgTheme } from "./theme";
import { ogPalettes } from "./theme";
import type { OgTemplate } from "./types";

const gradients: Record<OgTheme, string> = {
	dark: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
	light: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f5f3ff 100%)",
};

export const defaultTemplate: OgTemplate = ({
	description,
	fontFamily,
	og,
	theme,
	title,
}) => {
	const resolvedTheme = theme ?? "dark";
	const colors = ogPalettes[resolvedTheme];

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: gradients[resolvedTheme],
				color: colors.text,
				fontFamily,
				paddingBottom: 32 + og.safeArea.bottom,
				paddingLeft: 48,
				paddingRight: 48,
				paddingTop: 48,
			}}
		>
			<div
				style={{
					fontSize: 64,
					fontWeight: 700,
					textAlign: "center",
					lineHeight: 1.2,
					maxWidth: "90%",
				}}
			>
				{title}
			</div>

			{description ? (
				<div
					style={{
						fontSize: 28,
						color: colors.description,
						marginTop: 20,
						textAlign: "center",
						maxWidth: "85%",
					}}
				>
					{description}
				</div>
			) : null}

			<div
				style={{
					position: "absolute",
					bottom: 40 + og.safeArea.bottom,
					fontSize: 18,
					color: colors.muted,
				}}
			>
				better-og · {og.platform}
			</div>
		</div>
	);
};
