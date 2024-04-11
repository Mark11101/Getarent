import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const StarSvg = ({ color, width = 10, height = 10, ...props }) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		fill="none"

		{ ...props }
	>
		<Path
			fill={color || "#222"}
			d="M4.538.816c.145-.421.779-.421.924 0l.847 2.455a.484.484 0 0 0 .463.316h2.741c.47 0 .667.568.286.828L7.58 5.932a.443.443 0 0 0-.177.512l.847 2.455c.146.422-.367.772-.747.512L5.286 7.893a.51.51 0 0 0-.572 0L2.496 9.411c-.38.26-.893-.09-.747-.512l.847-2.455a.443.443 0 0 0-.177-.512L.201 4.415c-.38-.26-.185-.828.286-.828h2.741c.21 0 .398-.127.463-.316L4.538.816Z"
		/>
	</Svg>
)

export const CroppedStarSvg = ({ color, width = 10, height = 10, ...props }) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={17}
		height={16}
		fill="none"

		{ ...props }
	>
		<Path
			fill={color}
			d="M7.714.562c.248-.75 1.324-.75 1.572 0l1.44 4.364c.11.336.428.563.786.563h4.66c.8 0 1.133 1.008.486 1.471l-3.77 2.698a.807.807 0 0 0-.3.91l1.44 4.363c.247.75-.625 1.373-1.272.91l-3.77-2.697a.837.837 0 0 0-.972 0l-3.77 2.697c-.648.463-1.519-.16-1.271-.91l1.44-4.364a.807.807 0 0 0-.3-.91L.343 6.96C-.306 6.497.026 5.49.827 5.49h4.66a.825.825 0 0 0 .786-.563L7.714.562Z"
		/>
	</Svg>
)

export const StarMedalSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={14}
		height={14}
		fill="none"
		
		{ ...props }
	>
		<Path
			fill="#222"
			fillRule="evenodd"
			d="m12.728 5.708 1.128.975a.416.416 0 0 1-.005.634l-1.127.975a.422.422 0 0 0-.122.454l.49 1.406a.416.416 0 0 1-.315.549l-1.464.283a.417.417 0 0 0-.333.332l-.283 1.465a.418.418 0 0 1-.548.315l-1.406-.49a.414.414 0 0 0-.453.121l-.975 1.128a.419.419 0 0 1-.634 0l-.975-1.128a.421.421 0 0 0-.453-.121l-1.406.49a.416.416 0 0 1-.548-.315l-.283-1.465a.417.417 0 0 0-.333-.332L1.22 10.7a.418.418 0 0 1-.315-.548l.49-1.406a.414.414 0 0 0-.122-.454L.145 7.317a.419.419 0 0 1 0-.634l1.127-.975a.422.422 0 0 0 .122-.454l-.49-1.406a.416.416 0 0 1 .315-.549l1.464-.283a.417.417 0 0 0 .333-.332l.283-1.465c.049-.247.305-.4.548-.315l1.406.49a.413.413 0 0 0 .453-.121L6.681.145a.419.419 0 0 1 .634 0l.98 1.128c.111.13.291.175.453.121l1.406-.49a.416.416 0 0 1 .548.315l.278 1.465c.032.17.167.3.333.332l1.469.283c.247.05.4.306.315.549l-.49 1.406a.414.414 0 0 0 .121.454ZM8.667 7.825l1.38-1.164a.382.382 0 0 0-.226-.67l-1.796-.13-.679-1.672a.378.378 0 0 0-.7 0l-.679 1.672-1.797.13a.377.377 0 0 0-.216.665l1.38 1.164-.432 1.753a.378.378 0 0 0 .566.413L7 9.033l1.532.958a.38.38 0 0 0 .566-.414l-.431-1.752Z"
			clipRule="evenodd"
		/>
	</Svg>
)
