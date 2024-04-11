import { differenceInHours} from 'date-fns';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, FlatList, Alert, Text } from 'react-native';

import {
	Header,
	Waiter,
	CarItem,
	SafeAreaView,
	SearchControls,
} from 'components';
import api from 'api';
import theme from 'theme';
import actions from 'actions';
import { isAfter } from 'date-fns';
import SearchBarButton from './SearchBarButton';
import { sortTypes } from '../../actions/search';
import { calculateDiscountPrice } from 'functions';
import { getCity, cities } from 'constants/cities';
import MapScreen from 'screens/MapScreen/MapScreen';
import { useSearchControlsOffset, useListEmpty } from 'hooks';

import s from './styles';
import { trackCarEvent, trackCarCatalogEvent } from '../../myTrackerService';

const keyExtractor = o => o.uuid;

const emptyProps = {
	icon: 'car-error',
	iconSize: theme.normalize(112),
	text: 'Машины не найдены.\nПопробуйте изменить даты или сбросить дополнительные фильтры.',
};

export const Catalog = ({ route: { params: { triggerSearchBar } = {} } }) => {

	const dispatch = useDispatch();
    const [prevIndex, setPrevIndex] = useState(-1);
	const onLayoutContainer = useSearchControlsOffset();

	const {
		init,
		data,
		place,
		error,
		waiter,
		refreshing,
		period: { start, end },
	} = useSelector(st => st.search);
	
	const filters = useSelector(st => st.search.filters);

	const listEmptyProps = useListEmpty(emptyProps, init, error);

	React.useEffect(() => {

		const searchBySavedCity = async () => {

			const { isAppFirstLaunchImplemented } = await api.storage.get('isAppFirstLaunchImplemented');

			let savedCity;

			if (isAppFirstLaunchImplemented) {
				savedCity = await getCity();
			} else {
				savedCity = cities[0]
			};

			dispatch(actions.searchSetPlace(savedCity, true));

			setTimeout(() => {
				dispatch(actions.searchRequest());
			}, 0);
		};
	
		searchBySavedCity();

	}, []);

	const onPressSearch = useCallback(
		() => dispatch(actions.toggleSearchBar(true)),
		[dispatch]
	);

	const onPressCar = (item, start, end) => {

		if (isAfter(new Date(), start)) {

			Alert.alert(
				'',
				`Время истекло, пожалуйста, выберите более позднее время начала аренды`
			);
			
		} else {
			api.navigation.navigate('Car', { uuid: item.uuid }, true);
			trackCarEvent(item, start, end);
		}
	};

	const renderItem = useCallback(
		({ item }, start, end) => (
			<CarItem {...item} onPress={() => onPressCar(item, start, end)} />
		),
		[]
	);

	  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        viewableItems.forEach((item) => {
          if (item.isViewable) {
            setPrevIndex((prev) => {
              const currentIndex = item.index;
              if (currentIndex !== prev) {
                trackCarCatalogEvent(item)
                return currentIndex;
              } else {
                return prev;
              }
            });
          }
        });
      }, []);

	const onRefresh = useCallback(
		() => dispatch(actions.searchRequest(true)),
		[dispatch]
	);

	const [isMapShowed, setIsMapShowed] = useState(false);
	const [isMapError, setIsMapError] = useState(false);

	const period = useSelector(st => st.search.period);

	const resDateStart = period.start;
	const resDateEnd = period.end;

	const rentDuration = React.useMemo(
		() => (
            resDateStart &&
            resDateEnd &&
            Math.ceil(differenceInHours(resDateEnd, resDateStart) / 24)
        ) || 0,
		[resDateStart, resDateEnd]
	);

	const filterData = (data, filters) => {

		let carsList = data;

		if (filters.sortType === sortTypes.POPULAR) {
			return carsList;
		} else if (filters.sortType === sortTypes.CHEAP) {
			carsList.sort((a, b) => {

				const aDiscountPrice = calculateDiscountPrice({
					rentDuration,
					rentPricePerDay: a.rentPricePerDay,
					twoDaysDiscount: a.twoDaysDiscount,
					threeDaysDiscount: a.threeDaysDiscount,
					fiveDaysDiscount: a.fiveDaysDiscount,
					weekDiscount: a.weekDiscount,
					twoWeeksDiscount: a.twoWeeksDiscount,
					monthDiscount: a.monthDiscount,
				});

				const bDiscountPrice = calculateDiscountPrice({
					rentDuration,
					rentPricePerDay: b.rentPricePerDay,
					twoDaysDiscount: b.twoDaysDiscount,
					threeDaysDiscount: b.threeDaysDiscount,
					fiveDaysDiscount: b.fiveDaysDiscount,
					weekDiscount: b.weekDiscount,
					twoWeeksDiscount: b.twoWeeksDiscount,
					monthDiscount: b.monthDiscount,
				});

				return (aDiscountPrice.rentPricePerDay + (a.cascoFee || 0)) - (bDiscountPrice.rentPricePerDay + (b.cascoFee || 0))
			})
		} else if (filters.sortType === sortTypes.EXPENSIVE) {
			carsList.sort((a, b) => {

				const aDiscountPrice = calculateDiscountPrice({
					rentDuration,
					rentPricePerDay: a.rentPricePerDay,
					twoDaysDiscount: a.twoDaysDiscount,
					threeDaysDiscount: a.threeDaysDiscount,
					fiveDaysDiscount: a.fiveDaysDiscount,
					weekDiscount: a.weekDiscount,
					twoWeeksDiscount: a.twoWeeksDiscount,
					monthDiscount: a.monthDiscount,
				});

				const bDiscountPrice = calculateDiscountPrice({
					rentDuration,
					rentPricePerDay: b.rentPricePerDay,
					twoDaysDiscount: b.twoDaysDiscount,
					threeDaysDiscount: b.threeDaysDiscount,
					fiveDaysDiscount: b.fiveDaysDiscount,
					weekDiscount: b.weekDiscount,
					twoWeeksDiscount: b.twoWeeksDiscount,
					monthDiscount: b.monthDiscount,
				});

				return (bDiscountPrice.rentPricePerDay + (b.cascoFee || 0)) - (aDiscountPrice.rentPricePerDay + (a.cascoFee || 0))
			})
		} else if (filters.sortType === sortTypes.SUPERDRIVER) {
			carsList.sort((a, b) => b.owner.labels.includes('SUPERHOST') - a.owner.labels.includes('SUPERHOST'))
		} else if (filters.sortType === sortTypes.REVIEWS) {
			carsList.sort((a, b) => b.reviewsQty - a.reviewsQty)
		}
		
		return carsList;
	};

	return (
		<>
			<SafeAreaView 
				top 
				style={[
					s.container, 
					isMapShowed ? {zIndex: 500} : {zIndex: 1000}
				]} 
				onLayout={onLayoutContainer}
			>
				<Header withPressBack={false}>
					<SearchBarButton
						dateFrom={start}
						dateTo={end}
						onPress={onPressSearch}
						{...{ place }}
					/>
				</Header>
				<View style={s.flex}>
					{
						(waiter)
						?
							<Waiter />
						:
							data?.length !== 0
							?
								<FlatList
									initialNumToRender={4}
									style={s.flex}
									{...{
										refreshing,
										data: filterData(data, filters),
										keyExtractor,
										onRefresh,
										onViewableItemsChanged,
									}}
									{...listEmptyProps}
									renderItem={(item) => renderItem(item, start, end)}
									keyExtractor={item => item.uuid}
								/>
							:
								<View style={s.noData}>
									<Text style={s.noDataText}>
										Нет доступных машин
									</Text>
								</View>
					}
				</View>
			</SafeAreaView>
			<MapScreen 
				isMapShowed={isMapShowed}
				onCloseMap={() => setIsMapShowed(false)} 
				onMapError={() => setIsMapError(true)}
			/>
			<SearchControls 
				isMapError={isMapError}
				isMapShowed={isMapShowed}
				onPressList={() => setIsMapShowed(false)} 
				onPressMap={() => setIsMapShowed(true)} 
			/>
		</>
	);
}
