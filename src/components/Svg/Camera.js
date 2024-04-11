import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const CameraSvg = props => (
  	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={20}
		height={20}
		fill="none"
		{ ...props }
 	>
		<Path
			fill="#066BD6"
			fillRule="evenodd"
			d="M17.414 6.586A2 2 0 0 0 16 6h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 11.172 4H8.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 5.172 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-.586-1.414Zm-1.56 1.268a.5.5 0 1 1-.708-.708.5.5 0 0 1 .708.708Zm-8.329 5.12a3.5 3.5 0 1 1 4.95-4.949 3.5 3.5 0 0 1-4.95 4.95Zm.707-.706a2.5 2.5 0 1 1 3.536-3.536 2.5 2.5 0 0 1-3.536 3.536Z"
			clipRule="evenodd"
		/>
  </Svg>
)

export const CameraBigSvg = ({ color, ...props }) => (
  <Svg
		xmlns="http://www.w3.org/2000/svg"
		width={43}
		height={33}
		fill="none"
		{ ...props }
  >
		<Path
			fill={color || "#fff"}
			fillRule="evenodd"
			d="M2.218 7.217a5.292 5.292 0 0 1 3.742-1.55h3.1c1.404 0 2.75-.558 3.742-1.55l2.19-2.192a5.292 5.292 0 0 1 3.742-1.55h6.202c1.403 0 2.749.558 3.74 1.55l2.192 2.191a5.292 5.292 0 0 0 3.74 1.55h3.102A5.292 5.292 0 0 1 43 10.959v15.875a5.292 5.292 0 0 1-5.291 5.292H5.96a5.292 5.292 0 0 1-5.292-5.292V10.958c0-1.403.557-2.75 1.55-3.741Zm4.13 3.354a1.323 1.323 0 1 0 1.87-1.87 1.323 1.323 0 0 0-1.87 1.87Zm22.035 13.55a9.26 9.26 0 1 0-13.096-13.096A9.26 9.26 0 0 0 28.383 24.12Zm-1.871-1.87a6.615 6.615 0 1 0-9.354-9.355 6.615 6.615 0 0 0 9.354 9.354Z"
			clipRule="evenodd"
		/>
	</Svg>
)