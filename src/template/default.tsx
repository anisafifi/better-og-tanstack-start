import type { OgTemplate } from "./types";

export const defaultTemplate: OgTemplate = ({
	description,
	fontFamily,
	og,
	title,
}) => (
	<div
		style={{
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			background:
				"linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
			color: "#ffffff",
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
					opacity: 0.85,
					marginTop: 20,
					textAlign: "center",
					maxWidth: "85%",
				}}
			>
				{description}
			</div>
		) : null}
	</div>
);
