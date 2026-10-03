import type { OgTemplate } from "./types";

export const minimalTemplate: OgTemplate = ({
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
			justifyContent: "space-between",
			background: "#fafafa",
			color: "#111111",
			fontFamily,
			paddingBottom: 48 + og.safeArea.bottom,
			paddingLeft: 72,
			paddingRight: 72,
			paddingTop: 72,
		}}
	>
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					width: 96,
					height: 8,
					borderRadius: 9999,
					background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
				}}
			/>

			<div
				style={{
					fontSize: 68,
					fontWeight: 700,
					lineHeight: 1.15,
					marginTop: 40,
					maxWidth: "90%",
				}}
			>
				{title}
			</div>

			{description ? (
				<div
					style={{
						fontSize: 30,
						color: "#52525b",
						lineHeight: 1.35,
						marginTop: 24,
						maxWidth: "85%",
					}}
				>
					{description}
				</div>
			) : null}
		</div>

		<div
			style={{
				display: "flex",
				fontSize: 20,
				color: "#a1a1aa",
			}}
		>
			better-og · {og.platform}
		</div>
	</div>
);
