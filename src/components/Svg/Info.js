import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const InfoSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"

		{ ...props }
	>
		<Path
			fill="#878F9B"
			d="M8 16A8 8 0 1 0 8-.001 8 8 0 0 0 8 16Zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287H8.93ZM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
			opacity={0.5}
		/>
	</Svg>
)