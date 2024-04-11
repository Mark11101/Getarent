import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

export const PencilSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"

		{ ...props }
	>
		<Rect width={16} height={16} fill="#fff" rx={8} />
		<Path
			fill="#222"
			d="M10.427 4.073a.25.25 0 0 0-.354 0l-.823.824 1.853 1.853.824-.823a.251.251 0 0 0 0-.354l-1.5-1.5Zm.323 3.03L8.896 5.25 5.646 8.5h.104a.25.25 0 0 1 .25.25V9h.25a.25.25 0 0 1 .25.25v.25h.25a.25.25 0 0 1 .25.25V10h.25a.25.25 0 0 1 .25.25v.104l3.25-3.25Zm-3.734 3.735A.25.25 0 0 1 7 10.75v-.25h-.25a.25.25 0 0 1-.25-.25V10h-.25A.25.25 0 0 1 6 9.75V9.5h-.25a.25.25 0 0 1-.25-.25V9h-.25a.25.25 0 0 1-.088-.016l-.09.09a.25.25 0 0 0-.054.083l-1 2.5a.25.25 0 0 0 .325.325l2.5-1a.25.25 0 0 0 .084-.055l.089-.089Z"
		/>
	</Svg>
)
