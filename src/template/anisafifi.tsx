import { ogPalettes } from "./theme";
import type { OgTemplate } from "./types";

export const anisafifiTemplate: OgTemplate = ({
	description,
	fontFamily,
	og,
	theme,
	title,
}) => {
	const colors = ogPalettes[theme ?? "light"];

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				background: colors.background,
				color: colors.text,
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
						background: colors.accent,
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
							color: colors.description,
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
					fontSize: 12,
					color: colors.muted,
				}}
			>
				© Anis Afifi 2023 - {new Date().getFullYear()} • All rights reserved.
			</div>
		</div>
	);
};
