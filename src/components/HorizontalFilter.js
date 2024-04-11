import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import chroma from 'chroma-js';
import React, { useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import theme from 'theme';

const keyExtractor = o => `${o.label}-${o.value}`;
const ItemSeparatorComponent = () => <View style={styles.separator} />;

const HorizontalFilter = ({
	style,
	black,
	errors,
	filters,
	onPress,
	activeFilter,
	contentContainerStyle,
	...rest
}) => {

	const fl = useRef();
	const timer = useRef();
	const active = useRef(activeFilter);
	const counter = useRef(0);

	const renderItem = useCallback(

		({ item }) => {

			const isActive =
				activeFilter && activeFilter.value === item.value;

			const isError =
				errors && errors[item.value];

			return (
				<TouchableOpacity
					style={[
						styles.button, 
						isActive && styles.activeButton,
						black && styles.buttonBlack,
						isActive && black && styles.activeButtonBlack,
						isError && { 
							borderColor: theme.colors.red,
							backgroundColor: 'white', 
						},
					]}
					onPress={() => onPress(item)}
				>
					<Text
						style={[
							theme.styles.XS,
							black && styles.textBlack,
							isActive && styles.activeText,
							isActive && black && styles.activeTextBlack,
							isError && { color: theme.colors.red },
						]}
					>
						{item.label}
					</Text>
				</TouchableOpacity>
			);
		},
		[activeFilter, errors, onPress]
	);

	const scrollToActive = useCallback(() => {

		timer.current = setTimeout(
			() =>
				fl.current?.scrollToItem({
					item: active.current,
					viewPosition: 0.5,
				}),
			100
		);
	}, []);

	const onScrollToIndexFailed = useCallback(() => {

		if (counter.current < 10) {
			scrollToActive();
		} else {

			counter.current = 0;

			if (__DEV__) {
				console.warn(
					'[HorizontalFilter]: Maximum onScrollToIndexFailed call count exceeded'
				);
			}
		}
	}, [scrollToActive]);

	useFocusEffect(
		useCallback(
			() => {
				active.current = activeFilter;

				scrollToActive();

				return () => clearTimeout(timer.current);
			},
			[activeFilter]
		)
	);

	return (
		<View style={[styles.container, style]} {...rest}>
			<FlatList
				horizontal
				ref={fl}
				extraData={activeFilter}
				data={filters}
				showsHorizontalScrollIndicator={false}
				{...{
					contentContainerStyle,
					keyExtractor,
					renderItem,
					ItemSeparatorComponent,
					onScrollToIndexFailed,
				}}
			/>
		</View>
	);
};

export default React.memo(HorizontalFilter);

const styles = StyleSheet.create({
	button: {
		height: theme.normalize(32),
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: chroma(theme.colors.blue).alpha(0.6).css(),
		borderRadius: theme.normalize(32) / 2,
		borderWidth: theme.normalize(1),
		paddingHorizontal: theme.normalize(12),
	},
	buttonBlack: {
		backgroundColor: '#F5F5F7',
		borderColor: '#DBE3EF',
	},
	textBlack: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
	},
	activeButton: {
		backgroundColor: chroma(theme.colors.blue).alpha(0.1).css(),
	},
	activeButtonBlack: {
		backgroundColor: theme.colors.black,
		borderColor: 'none',
	},
	activeText: {
		color: theme.colors.blue,
	},
	activeTextBlack: {
		color: theme.colors.white,
	},
	separator: {
		width: theme.normalize(8),
	},
});
