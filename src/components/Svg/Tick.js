import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import theme from '../../theme'

export const TickSvg = ({ color, tickColor, active, ...props }) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={23}
		height={22}
		fill="none"
		{ ...props }
	>
		<Circle cx={11.5} cy={11} r={11} fill={color ? color : active ? theme.colors.blue : theme.colors.svgLightGrey} />
		<Path
			fill={tickColor || "#fff"}
			d="M8.065 11.561a.898.898 0 0 0-1.296 0 .961.961 0 0 0 0 1.334l2.75 2.829a.903.903 0 0 0 .648.276h.03a.91.91 0 0 0 .66-.322l6.416-7.543a.962.962 0 0 0-.085-1.33.9.9 0 0 0-1.294.087l-5.772 6.785-2.057-2.116Z"
		/>
  </Svg>
)
