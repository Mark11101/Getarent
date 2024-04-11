import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const WarningSvg = ({ color, ...props }) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={11}
		height={11}
		fill="none"
		{ ...props }
	>
		<Path
			fill={color || "#FF2E00"}
			d="M6.921.598a1.987 1.987 0 0 0-2.842 0l-.428.439-.612-.008a1.987 1.987 0 0 0-2.01 2.01l.007.613-.438.427a1.987 1.987 0 0 0 0 2.842l.438.428-.007.612a1.987 1.987 0 0 0 2.01 2.01l.612-.007.428.438a1.986 1.986 0 0 0 2.842 0l.428-.438.612.007a1.987 1.987 0 0 0 2.01-2.01l-.007-.612.438-.428a1.986 1.986 0 0 0 0-2.842l-.438-.427.007-.612a1.987 1.987 0 0 0-2.01-2.01l-.612.006L6.92.6ZM5.5 2.75c.368 0 .656.318.619.684l-.24 2.411a.38.38 0 0 1-.757 0l-.24-2.41A.622.622 0 0 1 5.5 2.75Zm.001 4.125a.688.688 0 1 1 0 1.376.688.688 0 0 1 0-1.376Z"
		/>
	</Svg>
)
