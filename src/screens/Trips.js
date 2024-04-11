import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';

import api from 'api';
import actions from 'actions';
import { STATUSES } from 'constants';
import { HorizontalFilter, TripCar, Empty, Waiter } from 'components';

import theme from 'theme';

const keyExtractor = o => o.rent.id;

const emptyProps = {
	icon: 'car-error-2',
	iconColor: theme.colors.lightCyan,
	iconSize: theme.normalize(184),
	buttonAction: () => api.navigation.jumpTo('SearchTab'),
};

const filters = [
	{ label: 'Все', value: undefined },
	{ label: 'В аренде', value: STATUSES.IN_PROGRESS },
	{ label: 'Подтверждено', value: STATUSES.APPROVED_BY_HOST },
	{ label: 'Ожидают подтверждения', value: STATUSES.AWAITS_HOST_APPROVAL },
	{ label: 'Завершено', value: STATUSES.FINISHED },
	{ label: 'Отменено', value: 'DECLINED' },
];

const Trips = () => {

	const dispatch = useDispatch();
	
	const { authorized, role } = useSelector(st => st.profile, shallowEqual);
	
	const { init, trips, error, waiter, refreshing } = useSelector(
		st => st.trips,
		shallowEqual
	);

	const [filter, setFilter] = useState(filters[0]);

	const onRefresh = useCallback(() => {

		if (authorized && role !== 'OBSERVER') {
			dispatch(actions.tripsRequest(role, filter.value, true));
		}
	}, [authorized, role, filter, dispatch]);

	const onPress = useCallback(
		uuid => api.navigation.navigate('RentRoom', { uuid }, true),
		[]
	);

	const renderItem = useCallback(
		({ item }) => (
			<TripCar
				item={item}
				{...item.car}
				{...item.rent}
				total={item.total}
				{...{ onPress }}
			/>
		),
		[onPress]
	);

	const ListEmptyComponent = useCallback(() => {

		const filtered = filter !== filters[0];

		return (
			<Empty
				{...emptyProps}
				text={
					filtered
						? 'Нет аренд с данным статусом'
						: 'Вы пока не начали ни одной аренды'
				}
				buttonText={filtered ? '' : 'Перейти к поиску'}
				buttonAction={() => api.navigation.navigate('RootTabs', { screen: 'LocationTab'})}
				{...{ error }}
			/>
		);
	}, [filter, error]);

	useEffect(() => setFilter(filters[0]), [authorized]);

	useFocusEffect(

		useCallback(

			() => {

				if (authorized && role !== 'OBSERVER') {
					dispatch(actions.tripsRequest(role, filter.value));
				}
			},

			[role, filter]
		)
	);
	
	useEffect(() => () => dispatch(actions.tripsReset()), []);
	
	return (
		<SafeAreaView style={theme.styles.container}>
			<Text style={[theme.styles.H3, styles.header, styles.content]}>
				Мои поездки
			</Text>
			{authorized && init && (
				<HorizontalFilter
					style={styles.filter}
					contentContainerStyle={styles.filterContent}
					activeFilter={filter}
					onPress={setFilter}
					{...{ filters }}
				/>
			)}

			<View style={theme.styles.flex}>
				<FlatList
					style={theme.styles.flex}
					contentContainerStyle={styles.flatListContent}
					data={authorized && trips.length ? trips : []}
					{...{
						refreshing,
						keyExtractor,
						renderItem,
						ListEmptyComponent,
						onRefresh,
					}}
				/>
				{waiter && <Waiter />}
			</View>
		</SafeAreaView>
	);
};

export default Trips;

const styles = StyleSheet.create({
	content: {
		marginHorizontal: theme.spacing(6),
	},
	filter: {
		marginVertical: theme.spacing(6),
	},
	filterContent: {
		paddingHorizontal: theme.spacing(6),
	},
	flatListContent: {
		paddingHorizontal: theme.spacing(6),
		flexGrow: 1,
	},
	header: {
		paddingTop: theme.spacing(5),
	},
});
