import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

export const FailSvg = props => (
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
