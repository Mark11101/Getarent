import {
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import React, { useContext, useMemo } from 'react';
import { useNavigationState } from '@react-navigation/native';

import api from 'api';
import Separator from './Separator';
import Icon from './Icon';
import { SearchControlsAnimatedValue } from 'context';

import theme from 'theme';

const height = theme.normalize(32);
const filtersHeight = height - theme.spacing(2);
const screens = ['Filters', 'Catalog', 'Car'];

const SearchControls = ({
	style,
	isMapShowed,
	onPressList,
	onPressMap,
	isMapError,
}) => {

	const animated = useContext(SearchControlsAnimatedValue);

	const onPressFilters = () => {

		api.navigation.navigate(
			'Filters',
			{
				isMapShowed: isMapShowed,
				fromMap: api.navigation.getCurrentRouteName() === 'Map',
			},
			true
		);
	};

	const { searchControlsOffset: top, filtersCount } = useSelector(
		st => st.search
	);

	const translateY = useMemo(
		() =>
			!animated
				? 0
				: animated.interpolate({
						inputRange: [0, 1],
						outputRange: [0, top || 1],
						extrapolate: 'clamp',
					}),
		[animated, top]
	);

	const name = api.navigation.getCurrentRouteName();

	useNavigationState(st => st); // Force re-render.

	if (!isMapShowed && !screens.includes(name)) {
		return null;
	}
	
	const isMapBtnDisabled = isMapError && !isMapShowed;
	
	return (
		<Animated.View
			style={[
				styles.container,
				{ top },
				{ transform: [{ translateY }] },
				style,
			]}
		>
			<TouchableOpacity
				style={styles.button}
				disabled={isMapBtnDisabled}
				onPress={isMapShowed ? onPressList : onPressMap}
			>
				<Icon
					style={styles.icon}
					name={isMapShowed ? 'list' : 'map'}
					size={theme.normalize(isMapShowed ? 18 : 15)}
					color={isMapBtnDisabled ? theme.colors.grey72 : theme.colors.blue}
				/>
				<Text style={[styles.label, isMapBtnDisabled && styles.greyText]}>
					{isMapShowed ? 'Список' : 'Карта'}
				</Text>
			</TouchableOpacity>
			<Separator vertical />
			<TouchableOpacity style={styles.button} onPress={onPressFilters}>
				<Icon
					style={styles.icon}
					name="settings"
					size={theme.normalize(13.5)}
					color={theme.colors.blue}
				/>
				<Text style={styles.label}>
					Фильтры
				</Text>
				{/* <View style={styles.filters}>
					<Text style={styles.count}>
						{filtersCount}
					</Text>
				</View> */}
			</TouchableOpacity>
		</Animated.View>
	);
}

export default React.memo(SearchControls);

const styles = StyleSheet.create({
	container: {
		...theme.shadow(10),
		position: 'absolute',
		height,
		borderRadius: height / 2,
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		zIndex: 1500,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginLeft: theme.spacing(3),
	},
	label: {
		...theme.styles.src.P2,
		color: theme.colors.blue,
		marginHorizontal: theme.spacing(2),
	},
	filters: {
		height: filtersHeight,
		width: filtersHeight,
		borderRadius: filtersHeight / 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.blue,
		margin: theme.spacing(1),
		marginLeft: 0,
	},
	count: {
		...theme.styles.src.P2,
		color: theme.colors.white,
	},
	greyText: {
		color: theme.colors.grey72,
	}
});
