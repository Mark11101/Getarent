import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const AccordionArrowSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={10}
		height={18}
		fill="none"

		{ ...props }
	>
		<Path
			stroke="#878F9B"
			strokeLinecap="round"
			strokeWidth={2}
			d="m1 17 7-8-7-8"
		/>
	</Svg>
)
