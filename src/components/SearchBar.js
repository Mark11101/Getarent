import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { formatInTimeZone } from 'date-fns-tz';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import Separator from './Separator';
import LocationBar from './LocationBar';
import BarBody from './BarBody';

import theme from 'theme';
import api from '../api';
import actions from '../actions';

const iconSize = theme.normalize(20);

const SearchBar = () => {
	const dispatch = useDispatch()

	const {
		place, period: { start, end }
	} = useSelector(state => state.search, shallowEqual)

	const _onPressLocation = React.useCallback(
		() => {
			dispatch(actions.toggleSearchBar(false))
			api.navigation.navigate('Location', { place }, true)
		},
		[ place, dispatch ]
	)

	const _onPressDate = React.useCallback(
		() => {
			dispatch(actions.toggleSearchBar(false))
			api.navigation.navigate(
				'DatePicker',
				{
					start,
					end,
					timeZone: place.timeZone,
					callback: (start, end) => 
						dispatch(actions.searchSetPeriod(start, end)),
				}
			)
		},
		[ start, end, place, dispatch ]
	)

	return (
		<View>
			<LocationBar
				style={styles.location}
				onPress={_onPressLocation}
				{...{ place }}
			/>
			<Separator />
			<TouchableOpacity style={styles.container} onPress={_onPressDate}>
				<BarBody
					style={theme.styles.flex}
					icon="calendar"
					{...{ iconSize }}
				>
					<DateTime date={start} timeZone={place?.timeZone} />
				</BarBody>
				<Separator style={styles.separator} />
				<BarBody
					style={theme.styles.flex}
					icon="calendar"
					{...{ iconSize }}
				>
					<DateTime date={end} timeZone={place?.timeZone} />
				</BarBody>
				<View style={styles.dash}>
					<Separator />
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default React.memo(SearchBar);

const DateTime = ({ date, timeZone }) => {

	if (!date) {
		return null;
	};

	return (
		<View style={styles.dateTime}>
			<Text style={styles.date}>
				{formatInTimeZone(date, timeZone, 'd.MM.yyyy')}
			</Text>
			<Text style={theme.styles.XS}>
				{formatInTimeZone(date, timeZone, 'H:mm')}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	location: {
		borderBottomWidth: 0,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	container: {
		...theme.styles.src.border,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopWidth: 0,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
	separator: {
		height: '100%',
		width: theme.normalize(1),
	},
	dash: {
		position: 'absolute',
		justifyContent: 'center',
		width: theme.normalize(20),
		height: theme.normalize(20),
		backgroundColor: theme.colors.white,
	},
	dateTime: {
		justifyContent: 'center',
	},
	date: {
		...theme.styles.src.P2,
		marginBottom: -theme.normalize(5),
	},
});
