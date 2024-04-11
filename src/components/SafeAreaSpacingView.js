import { View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { capitalize } from 'functions';

const edges = ['margin', 'padding'].reduce(
	(res, name) =>
		['top', 'bottom', 'left', 'right'].reduce(
			(res, edge) => ({
				...res,
				[`${name}${capitalize(edge)}`]: edge,
			}),
			res
		),
	{}
);

const variants = Object.keys(edges);

/**
 * Корректирует margin[Top|Bottom|Left|Right] и padding[Top|Bottom|Left|Right] переданного стиля,
 * чтобы они были не меньше отступов SaffeAreaView.
 * Корректирует только в том случае, если соответствующие стили определены.
 * Если для одного края определены и margin и padding - корректируется только margin.
 * Для иных случаев нужно использовать SafeAreaView или useSafeSpacing.
 */
const SafeAreaSpacingView = (props) => {

	const { style, ...rest } = props;

	const insets = useSafeAreaInsets();
	
	const correctedStyle = useMemo(() => {

		if (!style) {
			return undefined;
		}

		const correctedEdges = {};

		const generatedStyle = variants.reduce((res, name) => {

			const edge = edges[name];
			const styleValue = style[name];

			if (!correctedEdges[edge] && styleValue !== undefined) {

				res[name] = Math.max(style[name], insets[edge]);
				correctedEdges[edge] = true;
			};

			return res;

		}, {});

		return [style, generatedStyle];
		
	}, [style, insets]);

	return <View style={correctedStyle} {...rest} />;
};

export default React.memo(SafeAreaSpacingView);
