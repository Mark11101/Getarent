const getShadowProps = (height, shadowOpacity, shadowRadius) => ({
		shadowColor: 'rgb(36, 93, 150)',
		shadowOffset: {
			width: 0,
			height,
		},
		shadowOpacity,
		shadowRadius,
	}),
	shadows = {
		2: getShadowProps(1, 0.2, 1.41),
		10: getShadowProps(4, 0.15, 16),
		24: getShadowProps(12, 0.58, 16),
	};

export default function shadow(elevation) {
	return shadows[elevation];
}
