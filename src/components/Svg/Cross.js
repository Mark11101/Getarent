import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"

export const CrossSvg = ({ color = "#DBE3EF", ...props }) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={13}
		height={13}
		fill="none"
		{ ...props }
	>
		<Path
			fill={color}
			d="M12.293.664a1 1 0 0 0-1.414 0L6.293 5.25 1.707.664A1 1 0 0 0 .293 2.078l4.586 4.586L.293 11.25a1 1 0 0 0 1.414 1.414l4.586-4.586 4.586 4.586a1 1 0 0 0 1.414-1.414L7.707 6.664l4.586-4.586a1 1 0 0 0 0-1.414Z"
		/>
	</Svg>
)

export const RoundCrossSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={22}
		height={22}
		fill="none"

		{ ...props }
	>
		<Circle cx={11} cy={11} r={11} fill="#fff" />
		<Path
			fill="#FF2E00"
			d="M15.744 5.256a.874.874 0 0 0-1.236 0L10.5 9.264 6.492 5.256a.874.874 0 0 0-1.236 1.236L9.264 10.5l-4.008 4.008a.874.874 0 0 0 1.236 1.236l4.008-4.008 4.008 4.008a.874.874 0 0 0 1.236-1.236L11.736 10.5l4.008-4.008a.874.874 0 0 0 0-1.236Z"
		/>
	</Svg>
)
